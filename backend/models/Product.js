import mongoose from "mongoose";
import slugify from "slugify";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },


    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Relations
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    // Pricing
    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: null,
    },

    // Inventory
    // Inventory
    variants: [
      {
        size: {
          type: String,
          required: true,
        },

        color: {
          name: {
            type: String,
            required: true,
          },
          code: {
            type: String,
          },
        },

        stock: {
          type: Number,
          default: 0,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },


    lowStockThreshold: {
      type: Number,
      default: 5,
    },

    // Images
    thumbnail: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    // Reviews
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,

    },
    numReviews: {
      type: Number,
      default: 0,
    },



    // Search
    tags: [
      {
        type: String,
      },
    ],

    // Homepage
    featured: {
      type: Boolean,
      default: false,
    },

    // Visibility
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next;
});

export default mongoose.model("Product", productSchema);