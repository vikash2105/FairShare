import express from "express";
import { chat } from "../controllers/ai.controller.js";

const router = express.Router();

// AI chat route
router.post("/chat/:groupId", (req, res, next) => {
  req.body.groupId = req.params.groupId; // inject groupId into body for controller
  chat(req, res, next);
});

// ✅ Export as default so index.js can do: import aiRoutes from "./routes/ai.routes.js";
export default router;
