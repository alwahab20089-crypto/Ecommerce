import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";

// GET /api/reports/sales  (admin)  ?startDate=&endDate=
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    dateFilter.$lte = end;
  }

  const baseMatch = {};
  if (Object.keys(dateFilter).length) baseMatch.createdAt = dateFilter;

  // "sales" excludes cancelled orders — those never actually completed
  const salesMatch = { ...baseMatch, orderStatus: { $ne: "Cancelled" } };

  const [summary] = await Order.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalOrders: { $sum: 1 },
        totalItemsSold: { $sum: "$totalItems" },
      },
    },
  ]);

  const revenueOverTime = await Order.aggregate([
    { $match: salesMatch },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: salesMatch },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        thumbnail: { $first: "$items.thumbnail" },
        quantitySold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 10 },
  ]);

  // status breakdown includes ALL orders (cancelled too) — this is about order volume, not revenue
  const statusBreakdown = await Order.aggregate([
    { $match: baseMatch },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  res.json({
    summary: {
      totalRevenue: summary?.totalRevenue || 0,
      totalOrders: summary?.totalOrders || 0,
      totalItemsSold: summary?.totalItemsSold || 0,
      averageOrderValue: summary?.totalOrders ? summary.totalRevenue / summary.totalOrders : 0,
    },
    revenueOverTime,
    topProducts,
    statusBreakdown,
  });
});