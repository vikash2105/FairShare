import { Router } from "express";
import { history, spin } from "../controllers/spins.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All spin routes require authentication
router.use(authMiddleware);

router.post("/group/:id/spin", spin);
router.get("/group/:id/spins", history);

export default router;
