import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Trash2, Check } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

const WishlistPage = () => {
  const { items, isLoading, removeItem } = useWishlist();
  const { addItem: addCartItem, isGuest: cartGuest } = useCart();
  const navigate = useNavigate();
  const [addedItemId, setAddedItemId] = useState(null);

  useEffect(() => {
    if (!addedItemId) return;
    const timer = setTimeout(() => setAddedItemId(null), 2000);
    return () => clearTimeout(timer);
  }, [addedItemId]);

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-500">Loading your wishlist...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <Link to="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = (item) => {
    // can't safely guess a variant — send to the product page to choose instead
    if (item.hasVariants && !item.singleVariantId) {
      navigate(`/product/${item.slug}`);
      return;
    }

    if (cartGuest) {
      addCartItem({
        productId: item.productId,
        variantId: item.singleVariantId || null,
        name: item.name,
        slug: item.slug,
        thumbnail: item.thumbnail,
        price: item.price,
        quantity: 1,
        stock: 99,
      });
    } else {
      addCartItem({ productId: item.productId, variantId: item.singleVariantId || null, quantity: 1 });
    }

    setAddedItemId(item._id);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 relative">
      <h1 className="text-3xl font-extrabold mb-8 tracking-wide">Your Wishlist</h1>

      {/* toast */}
      {addedItemId && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} className="text-yellow-400" />
          <span className="text-sm">Added to cart</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border border-gray-200 rounded-xl p-4 relative">
            <button
              onClick={() => removeItem(item.productId)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 size={18} />
            </button>

            <Link to={`/product/${item.slug}`}>
              <img src={item.thumbnail} alt={item.name} className="w-full h-40 object-cover rounded-lg bg-gray-100 mb-3" />
              <p className="font-semibold hover:text-yellow-600">{item.name}</p>
            </Link>

            <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>

            {!item.inStock ? (
              <p className="text-sm text-red-500 mt-1">Out of stock</p>
            ) : (
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full mt-3 bg-black text-white py-2 rounded-full hover:bg-yellow-500 hover:text-black transition text-sm flex items-center justify-center gap-1.5"
              >
                {addedItemId === item._id ? (
                  <>
                    <Check size={14} /> Added
                  </>
                ) : item.hasVariants && !item.singleVariantId ? (
                  "Select Options"
                ) : (
                  "Add to Cart"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;