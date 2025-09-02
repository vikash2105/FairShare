import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { chat } from "../controllers/ai.controller.js";
const router = Router();
router.post("/chat", auth, chat);
router.post("/chat/:groupId", auth, (req,res,next)=>{ req.body.groupId = req.params.groupId; chat(req,res,next); });
export default router;
