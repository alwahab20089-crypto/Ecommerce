import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminOrdersQuery } from "../../hooks/useAdminOrders";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrdersPage = () => {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrdersQuery({ status, page, limit: 15 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex gap-2 mb-6">
        {["", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm ${status === s ? "bg-black text-white" : "bg-white border text-gray-600"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">Loading...</td></tr>
            ) : data?.orders?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No orders found</td></tr>
            ) : (
              data?.orders?.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.user?.firstName} {order.user?.lastName}
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">{formatPrice(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[order.orderStatus] || "bg-gray-100"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order._id}`} className="text-yellow-600 hover:underline text-sm">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-full text-sm ${page === p ? "bg-black text-white" : "bg-white border text-gray-600"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;