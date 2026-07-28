import { Link } from "react-router-dom";
import { useMyOrdersQuery } from "../hooks/useOrders";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrdersPage = () => {
  const { data: orders, isLoading } = useMyOrdersQuery();

  if (isLoading) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-500">Loading your orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Once you place an order, it'll show up here.</p>
        <Link to="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-yellow-500 hover:text-black transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8 tracking-wide">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block border border-gray-200 rounded-xl p-5 hover:border-yellow-500 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </div>

              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                {order.orderStatus}
              </span>

              <div className="text-right">
                <p className="font-bold">{formatPrice(order.totalPrice)}</p>
                <p className="text-sm text-gray-500">
                  {order.totalItems} item{order.totalItems !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;