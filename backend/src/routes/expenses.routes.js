import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addExpense, listGroupExpenses, getBalances } from "../controllers/expenses.controller.js";
const router = Router();
router.post("/", auth, addExpense);
router.get("/group/:groupId", auth, listGroupExpenses);
router.get("/group/:groupId/balances", auth, getBalances);
export default router;
