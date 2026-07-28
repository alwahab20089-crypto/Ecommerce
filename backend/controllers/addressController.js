import asyncHandler from "../utils/asyncHandler.js";
import Address from "../models/Address.js";

// GET /api/addresses
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(addresses);
});

// POST /api/addresses
export const createAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode || !country) {
    res.status(400);
    throw new Error("Please fill all required address fields.");
  }

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const addressCount = await Address.countDocuments({ user: req.user._id });

  const address = await Address.create({
    user: req.user._id,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault: isDefault || addressCount === 0, // first address becomes default automatically
  });

  res.status(201).json(address);
});

// PUT /api/addresses/:id
export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  if (req.body.isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  Object.assign(address, req.body);
  await address.save();

  res.json(address);
});

// DELETE /api/addresses/:id
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  await address.deleteOne();

  if (address.isDefault) {
    const next = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  res.json({ message: "Address deleted" });
});