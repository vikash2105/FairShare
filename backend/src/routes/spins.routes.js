import { Router } from "express";
import { listSpins, spin } from "../controllers/spins.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/group/:id/spins", listSpins);
router.post("/group/:id/spin", spin);

export default router;
