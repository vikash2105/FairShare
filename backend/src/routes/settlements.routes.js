import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { addSettlement, listSettlements } from "../controllers/settlements.controller.js";
const router = Router();
router.post("/", auth, addSettlement);
router.get("/group/:groupId", auth, listSettlements);
export default router;
