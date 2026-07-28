import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getEffectivePrice = (product) => {
  if (product.salePrice && product.salePrice < product.price) {
    return product.salePrice;
  }
  return product.price;
};

const CART_POPULATE_FIELDS = "name slug thumbnail price salePrice status variants stock";

const hasVariants = (product) => product.variants && product.variants.length > 0;

const itemMatches = (item, productId, variantId) =>
  item.product.toString() === productId &&
  (item.variant ? item.variant.toString() : null) === (variantId || null);

// build response: attach live stock/availability to each line, variant or not
const buildCartResponse = (cart) => {
  const items = cart.items
  .filter((item) => item.product)
  .map((item) => {
    let variantData = null;
    let currentStock;

    if (item.variant) {
      const variant = item.product.variants.id(item.variant);
      if (!variant) return null;
      variantData = { _id: variant._id, size: variant.size, color: variant.color, stock: variant.stock };
      currentStock = variant.stock;
    } else {
      currentStock = item.product.stock;
    }

    return {
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        thumbnail: item.product.thumbnail,
        status: item.product.status,
      },
      variant: variantData,
      quantity: item.quantity,
      price: item.price,
      stock: currentStock, 
      available: currentStock >= item.quantity && item.product.status === "Published",
    };
  })
  .filter(Boolean);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { _id: cart._id, user: cart.user, items, totalItems, totalPrice };
};

// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    CART_POPULATE_FIELDS
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json(buildCartResponse(cart));
});

// POST /api/cart  { productId, variantId?, quantity }
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, variantId = null, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.status !== "Published") {
    res.status(400);
    throw new Error("This product is not available");
  }

  let stockAvailable;

  if (hasVariants(product)) {
    if (!variantId) {
      res.status(400);
      throw new Error("Please select a size/color");
    }
    const variant = product.variants.id(variantId);
    if (!variant) {
      res.status(404);
      throw new Error("Variant not found");
    }
    stockAvailable = variant.stock;
  } else {
    stockAvailable = product.stock;
  }

  if (stockAvailable < quantity) {
    res.status(400);
    throw new Error("Not enough stock");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingItem = cart.items.find((item) =>
    itemMatches(item, productId, variantId)
  );

  const effectivePrice = getEffectivePrice(product);

  if (existingItem) {
    const newQuantity = existingItem.quantity + Number(quantity);
    if (newQuantity > stockAvailable) {
      res.status(400);
      throw new Error("Not enough stock");
    }
    existingItem.quantity = newQuantity;
    existingItem.price = effectivePrice;
  } else {
    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price: effectivePrice,
    });
  }

  await cart.save();
  await cart.populate("items.product", CART_POPULATE_FIELDS);

  res.status(200).json(buildCartResponse(cart));
});

// PUT /api/cart/:itemId  { quantity }
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }

  const product = await Product.findById(item.product);
  if (!product) {
    res.status(404);
    throw new Error("Product no longer exists");
  }

  const stockAvailable = item.variant
    ? product.variants.id(item.variant)?.stock ?? 0
    : product.stock;

  if (stockAvailable < quantity) {
    res.status(400);
    throw new Error("Not enough stock");
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product", CART_POPULATE_FIELDS);

  res.status(200).json(buildCartResponse(cart));
});

// DELETE /api/cart/:itemId
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not in cart");
  }

  item.deleteOne();
  await cart.save();
  await cart.populate("items.product", CART_POPULATE_FIELDS);

  res.status(200).json(buildCartResponse(cart));
});

// DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = [];
  await cart.save();

  res.status(200).json(buildCartResponse(cart));
});

export const mergeCart = asyncHandler(async (req, res) => {
  const { items } = req.body;

  // If there are no guest items, just return the user's cart
  if (!Array.isArray(items) || items.length === 0) {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      CART_POPULATE_FIELDS
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });

      await cart.populate("items.product", CART_POPULATE_FIELDS);
    }

    return res.status(200).json(buildCartResponse(cart));
  }

  // Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    });
  }

  // Merge guest items
  for (const guestItem of items) {
    const product = await Product.findById(guestItem.productId);

    if (!product || product.status !== "Published") continue;

    const variantId = guestItem.variantId || null;

    let stockAvailable;

if (hasVariants(product)) {
  if (!variantId) continue;

  const variant = product.variants.id(variantId);
  if (!variant) continue;

  stockAvailable = variant.stock;
} else {
  stockAvailable = product.stock ?? 0;
}

if (!Number.isFinite(stockAvailable) || stockAvailable < 1) {
  continue;
}

const safeQuantity = Math.min(
  Number(guestItem.quantity),
  stockAvailable
);

if (!Number.isFinite(safeQuantity) || safeQuantity < 1) {
  continue;
}

    const effectivePrice = getEffectivePrice(product);

    const existingItem = cart.items.find((item) =>
      itemMatches(item, guestItem.productId, variantId)
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        existingItem.quantity + safeQuantity,
        stockAvailable
      );
      existingItem.price = effectivePrice;
    } else {
      cart.items.push({
        product: guestItem.productId,
        variant: variantId,
        quantity: safeQuantity,
        price: effectivePrice,
      });
    }
  }

  await cart.save();

  await cart.populate("items.product", CART_POPULATE_FIELDS);

  return res.status(200).json(buildCartResponse(cart));
});