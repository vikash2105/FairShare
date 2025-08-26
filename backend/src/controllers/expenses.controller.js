import { Expense } from "../models/Expense.js";
import { Group } from "../models/Group.js";
import { User } from "../models/User.js";
import { Balance } from "../models/Balance.js";

export async function addExpense(req, res) {
  const { groupId, description, amount, paidBy, splitAmong } = req.body;
  if (!groupId || !description || !amount || !paidBy || !Array.isArray(splitAmong) || splitAmong.length === 0) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ error: "Group not found" });
  const isMember = group.members.map(String).includes(String(req.user.id));
  if (!isMember) return res.status(403).json({ error: "Not a group member" });

  const expense = await Expense.create({
    groupId, description, amount, paidBy, splitAmong, date: new Date(), createdBy: req.user.id
  });

  const splitAmount = amount / splitAmong.length;
  // Credit payer by (amount - splitAmount)
  await Balance.updateOne({ groupId, userId: paidBy }, { $inc: { balance: amount - splitAmount } }, { upsert: true });
  // Debit each split member except payer
  for (const uid of splitAmong) {
    if (String(uid) === String(paidBy)) continue;
    await Balance.updateOne({ groupId, userId: uid }, { $inc: { balance: -splitAmount } }, { upsert: true });
  }

  res.json(expense);
}

export async function listExpenses(req, res) {
  const { id } = req.params; // groupId
  const expenses = await Expense.find({ groupId: id }).sort({ date: -1 }).lean();
  // hydrate names
  const userIds = new Set();
  expenses.forEach(e => { userIds.add(String(e.paidBy)); e.splitAmong.forEach(s => userIds.add(String(s))); });
  const users = await User.find({ _id: { $in: Array.from(userIds) }}).select("_id name");
  const nameMap = new Map(users.map(u => [String(u._id), u.name || "User"]));
  const out = expenses.map(e => ({
    ...e,
    paidByName: nameMap.get(String(e.paidBy)) || "User",
    splitAmongDetails: e.splitAmong.map(s => ({ _id: s, name: nameMap.get(String(s)) || "User" }))
  }));
  res.json(out);
}

export async function getBalances(req, res) {
  const { id } = req.params; // groupId
  const balances = await Balance.find({ groupId: id }).lean();
  const users = await User.find({ _id: { $in: balances.map(b => b.userId) }}).select("_id name email");
  const map = new Map(users.map(u => [String(u._id), u]));
  const out = balances.map(b => ({
    userId: b.userId,
    userName: map.get(String(b.userId))?.name || "User",
    userEmail: map.get(String(b.userId))?.email || "",
    balance: b.balance
  }));
  res.json(out);
}
