import Balance from "../models/Balance.js";
import Group from "../models/Group.js";
import User from "../models/User.js";

// GET /balances/:groupId
export async function getBalances(req, res, next) {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) return res.status(404).json({ error: "Group not found" });

    const balances = await Balance.find({ groupId }).lean();

    // map balances by userId for easier lookup
    const balanceMap = {};
    for (const b of balances) {
      balanceMap[b.userId] = b.balance;
    }

    const result = group.members.map((m) => ({
      userId: m._id,
      name: m.name,
      email: m.email,
      balance: balanceMap[m._id] || 0,
    }));

    res.json({ groupId, balances: result });
  } catch (err) {
    next(err);
  }
}
