import { useState, useMemo, useEffect } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import RatingStars from "./RatingStars";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist";


const ProductInfo = ({ product }) => {
  const { addItem, isGuest } = useCart();
  const navigate = useNavigate();

  const hasVariants = product.variants?.length > 0;

  // unique sizes that actually exist across the product's variants
  const availableSizes = useMemo(() => {
    if (!hasVariants) return [];
    return [...new Set(product.variants.map((v) => v.size))];
  }, [product.variants, hasVariants]);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");

  // colors that exist for the currently selected size only
  const availableColors = useMemo(() => {
    if (!hasVariants || !selectedSize) return [];
    return product.variants
      .filter((v) => v.size === selectedSize)
      .map((v) => v.color);
  }, [product.variants, hasVariants, selectedSize]);

  const [selectedColor, setSelectedColor] = useState(availableColors[0] || null);
  const { isWishlisted, addItem: addWishlistItem, removeItem: removeWishlistItem, isGuest: wishlistGuest } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const buildCartPayload = () => ({
    productId: product._id,
    variantId: selectedVariant?._id || null,
    name: product.name,
    slug: product.slug,
    thumbnail: product.thumbnail,
    price,
    quantity,
    stock,
    variantLabel: selectedVariant
      ? `${selectedVariant.size} / ${selectedVariant.color.name}`
      : null,
  });


  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeWishlistItem(product._id);
    } else if (wishlistGuest) {
      addWishlistItem({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        thumbnail: product.thumbnail,
        price: product.price,
        salePrice: product.salePrice,
        inStock: stock > 0,
        hasVariants,
        singleVariantId: hasVariants && product.variants.length === 1 ? product.variants[0]._id : null,
      });
    } else {
      addWishlistItem({ productId: product._id });
    }
  };

  // reset color when size changes, if the previous color isn't valid for the new size
  useEffect(() => {
    if (!availableColors.find((c) => c.name === selectedColor?.name)) {
      setSelectedColor(availableColors[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return product.variants.find(
      (v) => v.size === selectedSize && v.color.name === selectedColor?.name
    );
  }, [product.variants, hasVariants, selectedSize, selectedColor]);

  const stock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;

  const [quantity, setQuantity] = useState(1);

  // clamp quantity if it exceeds the newly selected variant's stock
  useEffect(() => {
    setQuantity((q) => Math.min(Math.max(q, 1), Math.max(stock, 1)));
  }, [stock]);

  const [feedback, setFeedback] = useState("");

  const price =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;

  const discount =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const increaseQuantity = () => {
    if (quantity < stock) setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    setFeedback("");

    if (hasVariants && !selectedVariant) {
      setFeedback("Please select a size and color.");
      return;
    }
    if (stock < 1) {
      setFeedback("This item is out of stock.");
      return;
    }

    if (isGuest) {
      addItem(buildCartPayload());
      setFeedback("Added to cart!");
    } else {
      addItem(
        { productId: product._id, variantId: selectedVariant?._id || null, quantity },
        {
          onSuccess: () => setFeedback("Added to cart!"),
          onError: (err) =>
            setFeedback(err.response?.data?.message || "Could not add to cart."),
        }
      );
    }
  };

  const handleBuyNow = () => {
    setFeedback("");

    if (hasVariants && !selectedVariant) {
      setFeedback("Please select a size and color.");
      return;
    }
    if (stock < 1) {
      setFeedback("This item is out of stock.");
      return;
    }

    if (isGuest) {
      addItem(buildCartPayload());
      navigate("/checkout");
    } else {
      addItem(
        { productId: product._id, variantId: selectedVariant?._id || null, quantity },
        {
          onSuccess: () => navigate("/checkout"),
          onError: (err) =>
            setFeedback(err.response?.data?.message || "Could not add to cart."),
        }
      );
    }
  };
  return (
    <div className="space-y-6 sm:space-y-7">

      {/* Brand */}
      <p className="text-gray-500 text-sm sm:text-base tracking-widest uppercase">
        {product.brand?.name}
      </p>

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex text-yellow-500 text-sm sm:text-base">
          <RatingStars rating={product.rating} />
        </div>
        <span className="text-gray-700 text-sm sm:text-base font-medium">
          {product.rating.toFixed(1)}
        </span>
        <span className="text-gray-500 text-sm sm:text-base">
          ({product.numReviews} Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-t border-b border-gray-200 py-4">
        <span className="text-3xl sm:text-4xl font-bold text-black">${price}</span>
        {discount > 0 && (
          <>
            <span className="line-through text-gray-400 text-lg sm:text-xl">
              ${product.price}
            </span>
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs sm:text-sm font-medium tracking-wide">
              Save {discount}%
            </span>
          </>
        )}
      </div>

      {/* Stock */}
      <div className="space-y-2 text-gray-700 text-sm sm:text-base">
        <p>
          <strong className="text-black font-medium">Stock:</strong>{" "}
          <span className={stock > 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>
        <p>
          <strong className="text-black font-medium">SKU:</strong> {product.sku}
        </p>
        <p>
          <strong className="text-black font-medium">Category:</strong> {product.category?.name}
        </p>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="font-medium text-black mb-3 text-sm sm:text-base tracking-wide">Size</h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg border text-sm sm:text-base transition-all duration-200 ${selectedSize === size
                    ? "border-black bg-black text-yellow-400 font-medium"
                    : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="font-medium text-black mb-3 text-sm sm:text-base tracking-wide">Color</h3>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                aria-label={color.name}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-200 ${selectedColor?.name === color.name
                    ? "border-yellow-500 ring-2 ring-yellow-500/30"
                    : "border-gray-200 hover:border-gray-400"
                  }`}
                style={{ backgroundColor: color.code }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-medium text-black mb-3 text-sm sm:text-base tracking-wide">Quantity</h3>
        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
          <button
            onClick={decreaseQuantity}
            className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-5 sm:px-6 text-black font-medium">{quantity}</span>
          <button
            onClick={increaseQuantity}
            disabled={quantity >= stock}
            className="px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {feedback && (
        <p className={`text-sm ${feedback === "Added to cart!" ? "text-green-600" : "text-red-500"}`}>
          {feedback}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
        <button
          onClick={handleToggleWishlist}
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium border ${wishlisted ? "bg-black text-yellow-400 border-black" : "border-black text-black hover:bg-black hover:text-yellow-400"
            }`}
        >
          <FaHeart />
          {wishlisted ? "Wishlisted" : "Wishlist"}
        </button>
        <button
          onClick={handleAddToCart}
          disabled={stock < 1 || (hasVariants && !selectedVariant)}
          className="flex-1 bg-black text-yellow-400 py-3 rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaShoppingCart />
          Add To Cart
        </button>
      </div>

      <button
        onClick={handleBuyNow}
        disabled={stock < 1 || (hasVariants && !selectedVariant)}
        className="w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-black py-4 rounded-xl hover:opacity-90 transition-all duration-300 font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Buy Now
      </button>

    </div>
  );
};

export default ProductInfo;