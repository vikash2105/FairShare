import { Router } from "express";
import { addExpense, listExpenses, getBalances } from "../controllers/expenses.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/", addExpense);
router.get("/group/:id", listExpenses);
router.get("/group/:id/balances", getBalances);

export default router;
