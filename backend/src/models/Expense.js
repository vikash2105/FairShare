import mongoose from "mongoose";

const SplitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  share: { type: Number, default: 0 },
  percent: { type: Number },
  exact: { type: Number }
}, { _id:false });

const ExpenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, enum: ["general","food","travel","rent","utilities","shopping","entertainment","other"], default: "general" },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
  splitMethod: { type: String, enum: ["equal","exact","percent"], default: "equal" },
  splits: [SplitSchema],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Expense", ExpenseSchema);
