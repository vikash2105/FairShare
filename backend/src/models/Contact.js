import mongoose from "mongoose";
const ContactSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending","accepted","blocked"], default: "pending" }
}, { timestamps: true });
ContactSchema.index({ owner:1, friend:1 }, { unique: true });
export default mongoose.model("Contact", ContactSchema);
