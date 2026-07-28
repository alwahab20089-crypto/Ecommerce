import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import { useAddressesQuery, useCreateAddressMutation } from "../hooks/useAddresses";
import { useCreateOrderMutation } from "../hooks/useOrders";
import { useApplyCouponMutation } from "../hooks/useCoupon";


const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

const emptyAddressForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const CheckoutPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, isLoading: cartLoading } = useCart();
  // ...
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountAmount }
  const [couponError, setCouponError] = useState("");
  const applyCouponMutation = useApplyCouponMutation();

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) return;

    applyCouponMutation.mutate(
      { code: couponCode.trim(), subtotal: totalPrice },
      {
        onSuccess: (data) => setAppliedCoupon(data),
        onError: (err) => {
          setAppliedCoupon(null);
          setCouponError(err.response?.data?.message || "Invalid coupon");
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const finalTotal = totalPrice - (appliedCoupon?.discountAmount || 0);

  const { data: addresses, isLoading: addressesLoading } = useAddressesQuery();
  const createAddressMutation = useCreateAddressMutation();
  const createOrderMutation = useCreateOrderMutation();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // checkout is login-only — guests get sent to log in; their local cart is preserved
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (addresses?.length && !selectedAddressId) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses, selectedAddressId]);

  const handleAddressFormChange = (e) =>
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setError("");

    createAddressMutation.mutate(addressForm, {
      onSuccess: (newAddress) => {
        setSelectedAddressId(newAddress._id);
        setShowNewAddressForm(false);
        setAddressForm(emptyAddressForm);
      },
      onError: (err) => setError(err.response?.data?.message || "Could not save address"),
    });
  };

  const handlePlaceOrder = () => {
    setError("");

    if (!selectedAddressId) {
      setError("Please select or add a shipping address.");
      return;
    }

    // isPending flips true synchronously here — button disables immediately, before the
    // network call resolves, so a double-click can't fire two orders
   createOrderMutation.mutate(
  { addressId: selectedAddressId, paymentMethod: "cod", couponCode: appliedCoupon?.code || undefined },
  
      {
        onSuccess: (order) => setPlacedOrder(order),
        onError: (err) => setError(err.response?.data?.message || "Could not place order"),
      }
    );
  };

  if (cartLoading || addressesLoading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-500">Loading checkout...</div>;
  }

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-3">Order Placed!</h2>
        <p className="text-gray-500 mb-1">Order ID: {placedOrder._id}</p>
        <p className="text-gray-500 mb-6">
          Total: {formatPrice(placedOrder.totalPrice)} · Cash on Delivery
        </p>
        
        <div className="flex gap-3 justify-center">
          <Link to={`/orders/${placedOrder._id}`} className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
            View Order
          </Link>
          <Link to="/shop" className="inline-block border border-black px-6 py-3 rounded-full hover:bg-gray-50 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <Link to="/shop" className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8 tracking-wide">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">

          {/* Address selection */}
          <section>
            <h2 className="text-lg font-bold mb-4">Shipping Address</h2>

            {addresses?.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition ${selectedAddressId === addr._id
                      ? "border-yellow-500 ring-2 ring-yellow-500/20"
                      : "border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-semibold">
                        {addr.fullName}{" "}
                        {addr.isDefault && <span className="text-yellow-600 text-xs ml-1">(Default)</span>}
                      </p>
                      <p className="text-gray-600">{addr.phone}</p>
                      <p className="text-gray-600">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state}{" "}
                        {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!showNewAddressForm ? (
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="text-sm underline text-gray-600 hover:text-yellow-600"
              >
                + Add a new address
              </button>
            ) : (
              <form onSubmit={handleSaveAddress} className="border border-gray-200 rounded-xl p-5 space-y-3 mt-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input name="fullName" placeholder="Full name" value={addressForm.fullName} onChange={handleAddressFormChange} required className="border rounded px-3 py-2" />
                  <input name="phone" placeholder="Phone" value={addressForm.phone} onChange={handleAddressFormChange} required className="border rounded px-3 py-2" />
                </div>
                <input name="addressLine1" placeholder="Address line 1" value={addressForm.addressLine1} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />
                <input name="addressLine2" placeholder="Address line 2 (optional)" value={addressForm.addressLine2} onChange={handleAddressFormChange} className="w-full border rounded px-3 py-2" />
                <div className="grid sm:grid-cols-3 gap-3">
                  <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressFormChange} required className="border rounded px-3 py-2" />
                  <input name="state" placeholder="State" value={addressForm.state} onChange={handleAddressFormChange} required className="border rounded px-3 py-2" />
                  <input name="postalCode" placeholder="Postal code" value={addressForm.postalCode} onChange={handleAddressFormChange} required className="border rounded px-3 py-2" />
                </div>
                <input name="country" placeholder="Country" value={addressForm.country} onChange={handleAddressFormChange} required className="w-full border rounded px-3 py-2" />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={createAddressMutation.isPending}
                    className="bg-black text-white px-5 py-2 rounded-full hover:bg-yellow-500 hover:text-black transition"
                  >
                    {createAddressMutation.isPending ? "Saving..." : "Save Address"}
                  </button>
                  <button type="button" onClick={() => setShowNewAddressForm(false)} className="text-gray-500 hover:text-black">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Payment method */}
          <section>
            <h2 className="text-lg font-bold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 border border-yellow-500 ring-2 ring-yellow-500/20 rounded-xl p-4 cursor-pointer">
                <input type="radio" name="payment" checked readOnly />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled />
                <span>Card (Visa/Mastercard) — coming soon</span>
              </label>
              <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled />
                <span>PayPal — coming soon</span>
              </label>
            </div>
          </section>
        </div>

        {/* Order summary */}
        <div className="border border-gray-200 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} {item.variantLabel ? `(${item.variantLabel})` : ""} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mb-4">
  {!appliedCoupon ? (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
      />
      <button
        onClick={handleApplyCoupon}
        disabled={applyCouponMutation.isPending}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 hover:text-black transition disabled:opacity-40"
      >
        Apply
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
      <span className="text-sm text-green-700">Coupon "{appliedCoupon.code}" applied</span>
      <button onClick={handleRemoveCoupon} className="text-xs text-gray-500 hover:text-red-500">Remove</button>
    </div>
  )}
  {couponError && <p className="text-sm text-red-500 mt-1">{couponError}</p>}
</div>

          <div className="flex justify-between text-sm mb-2 border-t pt-3">
  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
  <span>{formatPrice(totalPrice)}</span>
</div>

{appliedCoupon && (
  <div className="flex justify-between text-sm mb-2 text-green-600">
    <span>Discount ({appliedCoupon.code})</span>
    <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
  </div>
)}

<div className="flex justify-between text-sm mb-4 text-gray-400">
  <span>Shipping</span>
  <span>Free</span>
</div>
<div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
  <span>Total</span>
  <span>{formatPrice(finalTotal)}</span>
</div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            onClick={handlePlaceOrder}
            disabled={createOrderMutation.isPending || !selectedAddressId}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createOrderMutation.isPending ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;