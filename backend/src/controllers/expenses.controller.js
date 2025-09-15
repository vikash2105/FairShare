import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Balance from "../models/Balance.js";

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export async function addExpense(req, res, next) {
  try {
    const { groupId, description, amount, paidBy, splitAmong } = req.body;
    const amt = Number(amount);

    if (
      !groupId ||
      !description ||
      !Number.isFinite(amt) ||
      amt <= 0 ||
      !paidBy ||
      !Array.isArray(splitAmong) ||
      splitAmong.length === 0
    ) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const isMember = group.members.map(String).includes(String(req.user.id));
    if (!isMember) return res.status(403).json({ error: "Not a group member" });

    // Create the expense
    const expense = await Expense.create({
      groupId,
      description: String(description).trim(),
      amount: amt,
      paidBy,
      splitAmong,
      createdBy: req.user.id,
    });

    // Equal split across selected members
    const share = round2(amt / splitAmong.length);

    // Update balances: payer gets +amount, each selected member gets -share
    await Promise.all([
      Balance.updateOne(
        { groupId, userId: paidBy },
        { $inc: { balance: amt } },
        { upsert: true }
      ),
      ...splitAmong.map((uid) =>
        Balance.updateOne(
          { groupId, userId: uid },
          { $inc: { balance: -share } },
          { upsert: true }
        )
      ),
    ]);

    res.status(201).json({ ok: true, expenseId: expense._id });
  } catch (err) {
    next(err);
  }
}

export async function getGroupExpenses(req, res, next) {
  try {
    const { id } = req.params; // groupId
    const expenses = await Expense.find({ groupId: id })
      .sort({ date: -1 })
      .lean();

    const userIds = Array.from(
      new Set(expenses.flatMap((e) => [e.paidBy, ...e.splitAmong]))
    );

    const users = await User.find({ _id: { $in: userIds } })
      .select("_id name email")
      .lean();

    const uMap = new Map(users.map((u) => [String(u._id), u]));

    res.json(
      expenses.map((e) => ({
        ...e,
        paidByName: uMap.get(String(e.paidBy))?.name || "User",
      }))
    );
  } catch (err) {
    next(err);
  }
}

export async function getBalances(req, res, next) {
  try {
    const { id } = req.params; // groupId
    const balances = await Balance.find({ groupId: id }).lean();

    const users = await User.find({
      _id: { $in: balances.map((b) => b.userId) },
    })
      .select("_id name email")
      .lean();

    const map = new Map(users.map((u) => [String(u._id), u]));

    const out = balances.map((b) => ({
      userId: b.userId,
      userName: map.get(String(b.userId))?.name || "User",
      userEmail: map.get(String(b.userId))?.email || "",
      balance: round2(b.balance),
    }));

    res.json(out);
  } catch (err) {
    next(err);
  }
}

export async function listExpenses(req, res, next) {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .populate("paidBy", "name email")
      .populate("splitAmong", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.json(expenses);
  } catch (err) {
    next(err);
  }
}
