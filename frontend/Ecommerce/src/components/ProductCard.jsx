import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import productPlaceholder from "../assets/images/product-placeholder.png";
import RatingStars from "./product/RatingStars";
import { useCart } from "../hooks/useCart";
import { useState } from "react";
import { useWishlist } from "../hooks/useWishlist";


const ProductCard = ({ product }) => {
  const { name, slug, thumbnail, category, numReviews, salePrice } = product;

  const [feedback, setFeedback] = useState("");
  const { addItem, isGuest } = useCart();
  const navigate = useNavigate();

  const hasVariants = product.variants && product.variants.length > 0;
  const singleVariant =
    hasVariants && product.variants.length === 1 ? product.variants[0] : null;

  // aggregate stock across all variants — used only for the "In Stock" badge
  const totalStock = hasVariants
    ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    : product.stock;

  // stock relevant to the actual quick-add action (only meaningful with 0 or 1 variant)
  const quickAddStock = hasVariants ? singleVariant?.stock ?? 0 : product.stock;

  const price = salePrice && salePrice < product.price ? salePrice : product.price;
  const discount =
    salePrice && salePrice < product.price
      ? Math.round(((product.price - salePrice) / product.price) * 100)
      : 0;

  const handleAddToCart = () => {
    setFeedback("");

    // multiple variants exist — can't safely guess which one, so send to the product page
    if (hasVariants && !singleVariant) {
      navigate(`/product/${slug}`);
      return;
    }

    if (quickAddStock < 1) {
      setFeedback("Out of stock");
      return;
    }

    if (isGuest) {
      addItem({
        productId: product._id,
        variantId: singleVariant?._id || null,
        name,
        slug,
        thumbnail,
        price,
        quantity: 1,
        stock: quickAddStock,
        variantLabel: singleVariant
          ? `${singleVariant.size} / ${singleVariant.color.name}`
          : null,
      });
      setFeedback("Added to cart!");
    } else {
      addItem(
        { productId: product._id, variantId: singleVariant?._id || null, quantity: 1 },
        {
          onSuccess: () => setFeedback("Added to cart!"),
          onError: (err) =>
            setFeedback(err.response?.data?.message || "Could not add to cart."),
        }
      );
    }
  };
  const { isWishlisted, addItem: addWishlistItem, removeItem: removeWishlistItem, isGuest: wishlistGuest } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const handleToggleWishlist = () => {
    if (wishlisted) {
      removeWishlistItem(product._id);
    } else if (wishlistGuest) {
      addWishlistItem({
        productId: product._id,
        name,
        slug,
        thumbnail,
        price: product.price,
        salePrice,
        inStock: totalStock > 0,
        hasVariants,
        singleVariantId: singleVariant?._id || null,
      });
    } else {
      addWishlistItem({ productId: product._id });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition-all duration-500 hover:border-yellow-400 hover:shadow-2xl"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <Link to={`/product/${slug}`}>
          <img
            src={thumbnail || productPlaceholder}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = productPlaceholder;
            }}
            className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
          />
        </Link>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-120%] top-0 h-full w-1/2 skew-x-12 bg-white/20 transition-all duration-1000 group-hover:left-[150%]" />
        </div>

        {discount > 0 && (
          <span className="absolute left-5 top-5 rounded-full bg-yellow-500 px-4 py-2 text-xs font-bold text-black shadow-lg">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 ${wishlisted ? "bg-yellow-500 text-black" : "bg-white/80 hover:bg-yellow-500 hover:text-black"
            }`}
        >
          <FaHeart />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
          {category?.name}
        </p>

        <Link to={`/product/${slug}`}>
          <h3 className="line-clamp-2 text-xl font-bold leading-7 text-black transition group-hover:text-yellow-600">
            {name}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex text-yellow-500">
            <RatingStars rating={product.rating} />
          </div>
          <span className="text-sm text-gray-500">{numReviews} Reviews</span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          {salePrice ? (
            <>
              <span className="text-3xl font-black text-yellow-600">${salePrice}</span>
              <span className="text-lg text-gray-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-3xl font-black text-black">${product.price}</span>
          )}
        </div>

        <div className="mt-4">
          {totalStock > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Out of Stock
            </span>
          )}
        </div>

        {feedback && (
          <p className={`mt-3 text-sm ${feedback === "Added to cart!" ? "text-green-600" : "text-red-500"}`}>
            {feedback}
          </p>
        )}

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <button
          onClick={handleAddToCart}
          disabled={totalStock < 1}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black py-3.5 group-hover:translate-x-1 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-500 hover:text-black hover:shadow-xl hover:shadow-yellow-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaShoppingCart />
          {totalStock < 1
            ? "Out of Stock"
            : hasVariants && !singleVariant
              ? "Select Options"
              : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;