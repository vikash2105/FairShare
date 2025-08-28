import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // ✅ storing hashed password
  name: { type: String },
  createdAt: { type: Date, default: Date.now },

  // --- OTP & Verification fields ---
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String },
  otpExpiry: { type: Date },
});

const User = mongoose.model("User", UserSchema);
export default User;
