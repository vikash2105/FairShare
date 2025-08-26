import { Router } from "express";
import { chat } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/chat", chat);
export default r;
