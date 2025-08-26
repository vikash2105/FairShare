import { Router } from "express";
import { addExpense, getBalances, listExpenses } from "../controllers/expenses.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/", addExpense);
r.get("/group/:id", listExpenses);
r.get("/group/:id/balances", getBalances);
export default r;
