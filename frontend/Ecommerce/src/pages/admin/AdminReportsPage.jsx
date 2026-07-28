import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSalesReportQuery } from "../../hooks/useAdminReports";

const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

const statusColors = {
  Processing: "text-yellow-600",
  Shipped: "text-blue-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-500",
};

const AdminReportsPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data, isLoading } = useSalesReportQuery({ startDate, endDate });

  const summary = data?.summary;
  const chartData = (data?.revenueOverTime || []).map((d) => ({ date: d._id, revenue: d.revenue }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales Reports</h1>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label className="text-sm font-medium block mb-1">From</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">To</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-3 py-2" />
        </div>
        {(startDate || endDate) && (
          <button onClick={() => { setStartDate(""); setEndDate(""); }} className="text-sm text-gray-500 hover:text-black underline mb-2">
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading report...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatPrice(summary?.totalRevenue || 0)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold mt-1">{summary?.totalOrders || 0}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Items Sold</p>
              <p className="text-2xl font-bold mt-1">{summary?.totalItemsSold || 0}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-bold mt-1">{formatPrice(summary?.averageOrderValue || 0)}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="font-bold mb-4">Revenue Over Time</h3>
            {chartData.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales data for this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar dataKey="revenue" fill="#EAB308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold mb-4">Top Selling Products</h3>
              {data?.topProducts?.length === 0 ? (
                <p className="text-gray-400 text-sm">No product sales in this period.</p>
              ) : (
                <div className="space-y-3">
                  {data?.topProducts?.map((p) => (
                    <div key={p._id} className="flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.quantitySold} sold</p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(p.revenue)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {data?.statusBreakdown?.map((s) => (
                  <div key={s._id} className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${statusColors[s._id] || "text-gray-600"}`}>{s._id}</span>
                    <span>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReportsPage;