import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

// GET /api/users  (admin) — ?search=&role=&page=&limit=
export const getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) query.role = role;

  const totalUsers = await User.countDocuments(query);

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ users, currentPage: Number(page), totalPages: Math.ceil(totalUsers / limit), totalUsers });
});

// PUT /api/users/:id  (admin)  { role?, isActive? }
export const updateUser = asyncHandler(async (req, res) => {
  try {
    const { role, isActive } = req.body;

    if (req.params.id === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot change your own role or status here.");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (role && !["customer", "admin"].includes(role)) {
      res.status(400);
      throw new Error("Invalid role");
    }

    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const { password, ...safeUser } = user.toObject();
    res.json(safeUser);
  } catch (err) {
    console.error("updateUser failed:", err); // TEMP — remove after debugging
    throw err;
  }
});