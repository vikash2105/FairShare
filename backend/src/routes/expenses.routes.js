import { Router } from "express";
import { addExpense, getGroupExpenses, getBalances } from "../controllers/expenses.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { listExpenses } from "../controllers/expenses.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/", addExpense);
router.get("/group/:id", getGroupExpenses);
router.get("/group/:id/balances", getBalances);
router.get("/:groupId", requireAuth, listExpenses);
export default router;
