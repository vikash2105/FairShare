import express from "express";
import { chat } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

// POST /ai/chat/:groupId
router.post("/chat/:groupId", (req, res, next) => {
  req.body.groupId = req.params.groupId; // inject groupId for controller
  chat(req, res, next);
});

export default router;
