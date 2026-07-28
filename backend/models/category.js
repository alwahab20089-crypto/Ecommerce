import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    icon: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next;
});

export default mongoose.model("Category", categorySchema);