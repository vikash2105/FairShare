// backend/controllers/ai.controller.js
import OpenAI from "openai";
import { addExpense } from "./expenses.controller.js";
import { getBalances } from "./balances.controller.js";
import Expense from "../models/Expense.js";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function chat(req, res, next) {
  try {
    const { message, groupId } = req.body;
    if (!message) return res.status(400).json({ reply: "⚠️ Message required" });
    if (!groupId) return res.status(400).json({ reply: "⚠️ groupId required" });

    const msg = message.toLowerCase();

    // --- INTENT: Add Expense ---
    if (msg.includes("add expense") || msg.includes("i paid")) {
      const amountMatch = msg.match(/([0-9]+(\.[0-9]+)?)/);
      if (!amountMatch) {
        return res.json({
          reply: "❌ I couldn't detect the amount in your message.",
        });
      }

      const amount = Number(amountMatch[0]);
      const description = message; // use full message as description
      const paidBy = req.user.id;
      const splitAmong = [req.user.id]; // TODO: parse mentioned names into userIds

      req.body = { groupId, description, amount, paidBy, splitAmong };

      // Fake response object to capture controller output
      const fakeRes = {
        status: () => fakeRes,
        json: (data) => data,
      };

      await addExpense(req, fakeRes, next);
      return res.json({
        reply: `✅ Expense added: ₹${amount} - "${description}"`,
      });
    }

    // --- INTENT: Balances ---
    if (msg.includes("balances") || msg.includes("who owes")) {
      req.params = { groupId };

      const fakeRes = {
        status: () => fakeRes,
        json: (data) => data,
      };

      const balanceResp = await getBalances(req, fakeRes, next);
      return res.json({
        reply: balanceResp
          ? JSON.stringify(balanceResp, null, 2)
          : "ℹ️ No balances found.",
      });
    }

    // --- INTENT: Expense History ---
    if (msg.includes("expenses") || msg.includes("history")) {
      const expenses = await Expense.find({ groupId })
        .populate("paidBy", "name")
        .sort({ createdAt: -1 })
        .lean();

      if (!expenses.length) {
        return res.json({ reply: "ℹ️ No expenses found for this group." });
      }

      const formatted = expenses
        .map((e) => `${e.paidBy.name} paid ₹${e.amount} for ${e.description}`)
        .join("\n");

      return res.json({ reply: formatted });
    }

    // --- Fallback: OpenAI ---
    if (!client) {
      return res
        .status(503)
        .json({ reply: "⚠️ AI not enabled (missing API key)" });
    }

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      });

      return res.json({ reply: completion.choices[0].message.content });
    } catch (err) {
      if (err.status === 429) {
        return res.status(429).json({
          reply: "⚠️ AI is busy (rate limit reached). Please try again later.",
        });
      }
      console.error("AI API Error:", err.response?.data || err.message);
      return res
        .status(500)
        .json({ reply: "❌ AI request failed. Try again later." });
    }
  } catch (err) {
    console.error("Chat Controller Error:", err);
    next(err);
  }
}
