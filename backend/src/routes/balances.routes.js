import express from "express";
import { getBalances } from "../controllers/balances.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:groupId", requireAuth, getBalances);

export default router;
