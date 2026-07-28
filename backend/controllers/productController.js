
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import recalculateRatings from "../utils/recalculateRatings.js";

import asyncHandler from "../utils/asyncHandler.js";


export const getProducts = asyncHandler(async (req, res) => {
  const {
    search, category, brand, minPrice, maxPrice, featured, onSale,
    page = 1, limit = 12, sort = "newest",
  } = req.query;

  const query = { status: "Published" };

  if (search) query.name = { $regex: search, $options: "i" };

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category });
    if (categoryDoc) query.category = categoryDoc._id;
  }

  if (brand) {
    const brandDoc = await Brand.findOne({ slug: brand });
    if (brandDoc) query.brand = brandDoc._id;
  }

  if (featured === "true") query.featured = true;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // on-sale needs a computed discount % to sort by, which a plain find().sort() can't do —
  // this branch uses aggregation instead, only when onSale is actually requested
  if (onSale === "true") {
    query.salePrice = { $ne: null, $gt: 0 };
    query.$expr = { $lt: ["$salePrice", "$price"] };

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          discountPercent: {
            $multiply: [
              { $divide: [{ $subtract: ["$price", "$salePrice"] }, "$price"] },
              100,
            ],
          },
        },
      },
      { $sort: { discountPercent: -1 } }, // biggest discount first, always
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
      { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
      { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
    ];

    const [products, totalProducts] = await Promise.all([
      Product.aggregate(pipeline),
      Product.countDocuments(query),
    ]);

    return res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  }

  
  let sortOption = {};
  switch (sort) {
    case "price-asc": sortOption = { price: 1 }; break;
    case "price-desc": sortOption = { price: -1 }; break;
    case "rating": sortOption = { rating: -1 }; break;
    case "oldest": sortOption = { createdAt: 1 }; break;
    default: sortOption = { createdAt: -1 };
  }

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ products, currentPage: Number(page), totalPages: Math.ceil(totalProducts / limit), totalProducts });
});

// NEW — admin-only, sees every product regardless of status
export const getAdminProducts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20, sort = "newest" } = req.query;

  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const totalProducts = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ products, currentPage: Number(page), totalPages: Math.ceil(totalProducts / limit), totalProducts });
});

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category", "name slug")
      .populate("brand", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const createProduct = async (req, res) => {
  try {
    const {
      name, sku, description, category, brand, price, salePrice, stock,
      thumbnail, images, tags, featured, status, metaTitle, metaDescription,
    } = req.body;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (brand) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res.status(404).json({ message: "Brand not found" });
      }
    }

    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await Product.create({
      name, sku, description, category, brand, price, salePrice, stock,
      thumbnail, images, tags, featured, status, metaTitle, metaDescription,
      createdBy: req.user._id, // <-- new
    });

    const newProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // only the admin who created this product may edit it
    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this product can edit it.",
      });
    }

    const { category, brand, sku } = req.body;

    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    if (brand && brand !== product.brand?.toString()) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res.status(404).json({ message: "Brand not found" });
      }
    }

    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ sku, _id: { $ne: product._id } });
      if (skuExists) {
        return res.status(400).json({ message: "SKU already exists" });
      }
    }

    Object.assign(product, req.body);
    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized. Only the admin who created this product can delete it.",
      });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: `${req.user.firstName} ${req.user.lastName}`,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);

  recalculateRatings(product);

  await product.save();

  const updatedProduct = await Product.findById(product._id)
    .populate("category", "name")
    .populate("brand", "name");

  res.status(201).json(updatedProduct);
});
const getRelatedProducts = async (req, res) => {
  const { categoryId } = req.params;
  const { exclude, limit = 4 } = req.query;

  const products = await Product.find({
    category: categoryId,
    _id: { $ne: exclude },
  })
    .limit(Number(limit))
    .populate("category brand");

  res.json(products);
};
export const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findOne({
    "reviews._id": req.params.reviewId,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.id(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this review");
  }

  review.rating = Number(rating);
  review.comment = comment;

  recalculateRatings(product);

  await product.save();


  const updatedProduct = await Product.findById(product._id)
    .populate("category", "name")
    .populate("brand", "name");

  res.json(updatedProduct);
});
export const deleteProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    "reviews._id": req.params.reviewId,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.id(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  review.deleteOne();

  recalculateRatings(product);

  await product.save();

  const updatedProduct = await Product.findById(product._id)
    .populate("category", "name")
    .populate("brand", "name")
    .populate("reviews.user", "firstName lastName");

  res.json(updatedProduct);
});