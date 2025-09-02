import OpenAI from "openai";
import { addExpense } from "./balances.controller.js";
import { getBalances } from "./balances.controller.js";
import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import { addSettlement } from "./settlements.controller.js";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function tryParseAmount(msg){
  const m = msg.match(/(?:(?:rs|₹|inr)\s*)?(\d+(?:\.\d+)?)/i);
  return m ? Number(m[1]) : null;
}

export async function chat(req,res,next){
  try {
    const { message, groupId } = req.body;
    if (!message) return res.status(400).json({ reply: "⚠️ Message required" });
    if (!groupId) return res.status(400).json({ reply: "⚠️ groupId required" });

    const msg = message.toLowerCase();
    const amount = tryParseAmount(message);

    // Add expense intent
    if (msg.includes("i paid") || msg.includes("add expense") || msg.startsWith("split")) {
      if (!amount) return res.json({ reply: "❌ Couldn't detect the amount." });

      // description heuristics
      let description = message;
      const afterFor = message.split(/ for | on /i)[1];
      if (afterFor) description = afterFor.split(" with ")[0].trim();

      const group = await Group.findById(groupId).populate("members","name _id");
      if (!group) return res.status(404).json({ reply: "Group not found" });

      const mentionedIds = [];
      for (const m of group.members) {
        const r = new RegExp(`\b${m.name}\b`, "i");
        if (r.test(message) && !mentionedIds.includes(String(m._id))) mentionedIds.push(String(m._id));
      }
      const participants = mentionedIds.length ? mentionedIds : group.members.map(m=>m._id);

      req.body = {
        groupId,
        description: description || "Expense",
        amount,
        paidBy: req.user.id,
        participants,
        splitMethod: "equal"
      };

      const fakeRes = { status: ()=>fakeRes, json: (d)=>d };
      await addExpense(req, fakeRes, next);
      return res.json({ reply: `✅ Added ₹${amount} for "${description}" split among ${participants.length}` });
    }

    // Balances
    if (msg.includes("balances") || msg.includes("who owes")) {
      req.params = { groupId };
      const fakeRes = { status: ()=>fakeRes, json: (d)=>d };
      const data = await getBalances(req, fakeRes, next);
      return res.json({ reply: JSON.stringify(data, null, 2) });
    }

    // History
    if (msg.includes("expenses") || msg.includes("history")) {
      const expenses = await Expense.find({ groupId }).populate("paidBy","name").sort({ createdAt: -1 }).lean();
      if (!expenses.length) return res.json({ reply: "No expenses yet." });
      const formatted = expenses.slice(0,10).map(e=> `${e.paidBy.name} paid ₹${e.amount} for ${e.description}`).join("\n");
      return res.json({ reply: formatted });
    }

    // Settle intent
    if (msg.includes("settle")) {
      if (!amount) return res.json({ reply: "❌ Couldn't detect amount to settle." });
      const group = await Group.findById(groupId).populate("members","name _id");
      let target = null;
      for (const m of group.members) {
        const r = new RegExp(`\b${m.name}\b`, "i");
        if (r.test(message)) { target = m._id; break; }
      }
      if (!target) return res.json({ reply: "❌ Couldn't find the person to settle with." });
      req.body = { groupId, from: req.user.id, to: target, amount, method: "other", note: "AI" };
      const fakeRes = { status: ()=>fakeRes, json: (d)=>d };
      await addSettlement(req, fakeRes, next);
      return res.json({ reply: `✅ Recorded settlement of ₹${amount}.` });
    }

    if (!client) return res.status(503).json({ reply: "AI not enabled" });

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }]
      });
      return res.json({ reply: completion.choices[0].message.content });
    } catch(err){
      if (err.status === 429) return res.status(429).json({ reply: "⚠️ AI busy. Try later." });
      return res.status(500).json({ reply: "❌ AI request failed." });
    }
  } catch(e){ next(e); }
}
