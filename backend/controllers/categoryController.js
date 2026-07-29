import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image, icon, displayOrder, isActive } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name, image, icon, displayOrder, isActive,
      createdBy: req.user._id, // <-- new
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this category can edit it.",
      });
    }

    const { name, image, icon, displayOrder, isActive } = req.body;
    if (name !== undefined) category.name = name;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this category can delete it.",
      });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};