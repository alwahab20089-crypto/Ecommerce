import asyncHandler from "../utils/asyncHandler.js";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const WISHLIST_POPULATE_FIELDS =
  "name slug thumbnail price salePrice status variants stock rating numReviews";

const buildWishlistResponse = (wishlist) => {
  const items = wishlist.items
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      const hasVariants = product.variants && product.variants.length > 0;
      const totalStock = hasVariants
        ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : product.stock;
      const singleVariant = hasVariants && product.variants.length === 1 ? product.variants[0] : null;

      return {
        _id: item._id,
        product: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          thumbnail: product.thumbnail,
          price: product.price,
          salePrice: product.salePrice,
          status: product.status,
          rating: product.rating,
          numReviews: product.numReviews,
        },
        hasVariants,
        singleVariantId: singleVariant?._id || null,
        inStock: totalStock > 0 && product.status === "Published",
        addedAt: item.createdAt,
      };
    });

  return { _id: wishlist._id, user: wishlist.user, items };
};

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "items.product",
    WISHLIST_POPULATE_FIELDS
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  res.status(200).json(buildWishlistResponse(wishlist));
});

// POST /api/wishlist  { productId }
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, items: [] });

  const alreadyExists = wishlist.items.some((item) => item.product.toString() === productId);
  if (!alreadyExists) {
    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  await wishlist.populate("items.product", WISHLIST_POPULATE_FIELDS);
  res.status(200).json(buildWishlistResponse(wishlist));
});

// DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.items = wishlist.items.filter((item) => item.product.toString() !== productId);

  await wishlist.save();
  await wishlist.populate("items.product", WISHLIST_POPULATE_FIELDS);

  res.status(200).json(buildWishlistResponse(wishlist));
});

// POST /api/wishlist/merge  { productIds: [] }
export const mergeWishlist = asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    const wishlist =
      (await Wishlist.findOne({ user: req.user._id }).populate("items.product", WISHLIST_POPULATE_FIELDS)) ||
      (await Wishlist.create({ user: req.user._id, items: [] }));
    return res.status(200).json(buildWishlistResponse(wishlist));
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, items: [] });

  for (const productId of productIds) {
    const product = await Product.findById(productId);
    if (!product) continue;

    const alreadyExists = wishlist.items.some((item) => item.product.toString() === productId);
    if (!alreadyExists) wishlist.items.push({ product: productId });
  }

  await wishlist.save();
  await wishlist.populate("items.product", WISHLIST_POPULATE_FIELDS);

  res.status(200).json(buildWishlistResponse(wishlist));
});