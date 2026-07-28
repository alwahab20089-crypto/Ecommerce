import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAdminOrderQuery, useUpdateOrderStatusMutation } from "../../hooks/useAdminOrders";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useAdminOrderQuery(id);
  const updateMutation = useUpdateOrderStatusMutation();

  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
      setPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  const handleSave = () => {
    setMessage("");
    updateMutation.mutate(
      { id, orderStatus, paymentStatus },
      {
        onSuccess: () => setMessage("Order updated"),
        onError: (err) => setMessage(err.response?.data?.message || "Could not update order"),
      }
    );
  };

  if (isLoading) return <p className="text-gray-500">Loading order...</p>;
  if (!order) return <p className="text-gray-500">Order not found</p>;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-black">&larr; Back to orders</Link>

      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <p className="text-sm text-gray-500">Placed {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 border border-gray-200 rounded-xl p-4 bg-white">
              <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                {item.variantLabel && <p className="text-sm text-gray-500">{item.variantLabel}</p>}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="font-bold mb-2">Customer</h3>
            <p className="text-sm text-gray-600">{order.user?.firstName} {order.user?.lastName}</p>
            <p className="text-sm text-gray-600">{order.user?.email}</p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h3 className="font-bold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Order Status</label>
              <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {orderStatus === "Cancelled" && order.orderStatus !== "Cancelled" && (
                <p className="text-xs text-amber-600 mt-1">This will restore stock for all items in this order.</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Payment Status</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <p className="text-sm text-gray-500 capitalize">
              Payment method: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>

            {message && <p className={`text-sm ${message === "Order updated" ? "text-green-600" : "text-red-500"}`}>{message}</p>}

            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-yellow-500 hover:text-black transition disabled:opacity-40"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Items</span>
              <span>{order.totalItems}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;