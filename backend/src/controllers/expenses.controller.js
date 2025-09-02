import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";

function computeSplits({ amount, splitMethod, participants, payload }) {
  const n = participants.length;
  if (n <= 0) throw new Error("No participants provided");

  if (splitMethod === "equal") {
    const share = Number((amount / n).toFixed(2));
    const splits = participants.map((u) => ({ user: u, share }));
    const sum = splits.reduce((a, s) => a + s.share, 0);
    const diff = Number((amount - sum).toFixed(2));
    if (diff !== 0) splits[splits.length - 1].share = Number((splits[splits.length - 1].share + diff).toFixed(2));
    return splits;
  }

  if (splitMethod === "exact") {
    const exacts = payload?.exacts || [];
    const map = new Map(exacts.map((e) => [String(e.user), Number(e.amount)]));
    const splits = participants.map((u) => ({ user: u, share: Number(map.get(String(u)) || 0), exact: Number(map.get(String(u)) || 0) }));
    const sum = splits.reduce((a, s) => a + s.share, 0);
    if (Number(sum.toFixed(2)) !== Number(amount.toFixed(2))) throw new Error("Exact splits must sum to total amount");
    return splits;
  }

  if (splitMethod === "percent") {
    const percents = payload?.percents || [];
    const map = new Map(percents.map((p) => [String(p.user), Number(p.percent)]));
    const splits = participants.map((u) => {
      const pct = Number(map.get(String(u)) || 0);
      const share = Number(((pct / 100) * amount).toFixed(2));
      return { user: u, share, percent: pct };
    });
    const sum = splits.reduce((a, s) => a + s.share, 0);
    const diff = Number((amount - sum).toFixed(2));
    if (Math.abs(diff) > 0.02) throw new Error("Percent splits must add up to ~100%");
    if (diff !== 0) splits[splits.length - 1].share = Number((splits[splits.length - 1].share + diff).toFixed(2));
    return splits;
  }

  throw new Error("Unsupported split method");
}

export async function addExpense(req,res,next){
  try {
    const { groupId, description, amount, paidBy, participants, splitMethod="equal", category="general", payload } = req.body;
    const group = await Group.findById(groupId).lean();
    if (!group) return res.status(404).json({ error: "Group not found" });

    const part = (participants && participants.length) ? participants : group.members;
    const splits = computeSplits({ amount: Number(amount), splitMethod, participants: part, payload });

    const expense = await Expense.create({ groupId, description, amount, category, paidBy, participants: part, splitMethod, splits });
    const populated = await Expense.findById(expense._id).populate("paidBy", "name").populate("participants", "name");
    res.status(201).json(populated);
  } catch(e){ next(e); }
}

export async function listGroupExpenses(req,res,next){
  try {
    const exps = await Expense.find({ groupId: req.params.groupId }).populate("paidBy","name").sort({ createdAt: -1 });
    res.json(exps);
  } catch(e){ next(e); }
}

export async function getBalances(req,res,next){
  try {
    const groupId = req.params.groupId || req.body.groupId;
    const expenses = await Expense.find({ groupId }).lean();
    const settlements = await Settlement.find({ groupId }).lean();

    const bal = {}; // userId -> balance
    const add = (u, v)=>{ bal[u]=Number((bal[u]||0)+v); };

    for (const ex of expenses) {
      add(String(ex.paidBy), ex.amount); // payer paid
      for (const s of ex.splits) {
        add(String(s.user), -s.share);   // owed by participant
      }
    }
    // apply settlements: from pays to
    for (const st of settlements) {
      add(String(st.from), -st.amount);
      add(String(st.to), st.amount);
    }

    // pretty
    const result = Object.entries(bal).map(([user, balance]) => ({ user, balance: Number(balance.toFixed(2)) }));
    res.json({ balances: result });
  } catch(e){ next(e); }
}
