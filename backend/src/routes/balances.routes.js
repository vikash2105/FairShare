import express from "express";
import { getBalances } from "../controllers/balances.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:groupId", auth, getBalances);

export default router;
