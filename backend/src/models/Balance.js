import mongoose from "mongoose";

const BalanceSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  balance: { type: Number, default: 0 }
});
BalanceSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export const Balance = mongoose.model("Balance", BalanceSchema);
