import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        isActive: {
            type: Boolean,
            default: true,
        },
        resetPasswordToken: { type: String, default: undefined },
        resetPasswordExpire: { type: Date, default: undefined },
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: false
        },
        googleId: {
            type: String,
            default: null,
        },

        phone: {
            type: String,
            default: ""
        },

        avatar: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },

        isVerified: {
            type: Boolean,
            default: false
        }


    },
    {
        timestamps: true
    }
);
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next;
});


userSchema.methods.matchPassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};
export default mongoose.model("User", userSchema);