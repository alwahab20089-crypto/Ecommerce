import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

const CartPage = () => {
  const { items, totalItems, totalPrice, isLoading, updateItem, removeItem, isGuest } = useCart();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-500">
        Loading your cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8 tracking-wide">
        Your Cart <span className="text-yellow-500">({totalItems})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`flex gap-4 border border-gray-200 rounded-xl p-4 ${!item.available ? "opacity-60" : ""
                }`}
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg bg-gray-100 flex-shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.slug}`} className="font-semibold hover:text-yellow-600">
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <p className="text-sm text-gray-500">{item.variantLabel}</p>
                  )}
                  {!item.available && (
                    <p className="text-sm text-red-500 mt-1">
                      {item.stock === 0 ? "Out of stock" : `Only ${item.stock} left`}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <button
                      onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      className="p-2 disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item._id, Math.min(item.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.stock}
                      className="p-2 disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="text-right font-semibold whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border border-gray-200 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Subtotal ({totalItems} items)</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4 text-gray-400">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          {items.some((i) => !i.available) ? (
            <button
              disabled
              className="w-full bg-black text-white py-3 rounded-full opacity-40 cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          ) : (
            <Link
              to="/checkout"
              className="block w-full text-center bg-black text-white py-3 rounded-full hover:bg-yellow-500 hover:text-black transition"
            >
              Proceed to Checkout
            </Link>
          )}

          {isGuest && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              <Link to="/login" className="underline">Log in</Link> to save your cart across devices.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;