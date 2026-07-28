import Brand from "../models/Brand.js";

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const { name, logo, website, description, isActive } = req.body;

    const exists = await Brand.findOne({ name });
    if (exists) return res.status(400).json({ message: "Brand already exists" });

    const brand = await Brand.create({
      name, logo, website, description, isActive,
      createdBy: req.user._id, // <-- new
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    if (brand.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this brand can edit it.",
      });
    }

    const { name, logo, website, description, isActive } = req.body;
    if (name !== undefined) brand.name = name;
    if (logo !== undefined) brand.logo = logo;
    if (website !== undefined) brand.website = website;
    if (description !== undefined) brand.description = description;
    if (isActive !== undefined) brand.isActive = isActive;

    const updated = await brand.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    if (brand.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this brand can delete it.",
      });
    }

    await brand.deleteOne();
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};