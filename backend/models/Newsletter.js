import mongoose from "mongoose";
import validator from "validator";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid email address.",
      },
    },
    isActive: {
      type: Boolean,
      default: true, // supports unsubscribe later without deleting the record
    },
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);