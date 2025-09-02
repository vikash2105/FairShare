import mongoose from "mongoose";

const SpinSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", index: true },
    selectedMember: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    spinBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

const Spin = mongoose.model("Spin", SpinSchema);
export default Spin;
