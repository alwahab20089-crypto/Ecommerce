import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useOrderQuery, useCancelOrderMutation } from "../hooks/useOrders";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrderQuery(id);
  const cancelMutation = useCancelOrderMutation();
  const [error, setError] = useState("");

  const handleCancel = () => {
    setError("");
    cancelMutation.mutate(id, {
      onError: (err) => setError(err.response?.data?.message || "Could not cancel order"),
    });
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
        <Link to="/orders" className="text-yellow-600 underline">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/orders" className="text-sm text-gray-500 hover:text-black">&larr; Back to orders</Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 border border-gray-200 rounded-xl p-4">
              <img src={item.thumbnail} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                {item.variantLabel && <p className="text-sm text-gray-500">{item.variantLabel}</p>}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold mb-2">Payment</h3>
            <p className="text-sm text-gray-600 capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
            <p className="text-sm text-gray-600 capitalize">Status: {order.paymentStatus}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Items</span>
              <span>{order.totalItems}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {order.orderStatus === "Processing" && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="w-full border border-red-300 text-red-600 py-3 rounded-full hover:bg-red-50 transition disabled:opacity-40"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;