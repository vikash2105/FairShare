import { Router } from "express";
import { listSpins, spin, spinRandom } from "../controllers/spins.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Get all spins for a group
router.get("/group/:id/spins", listSpins);

// Record a spin result provided by frontend
router.post("/group/:id/spin", spin);

// Perform a random spin on backend
router.post("/group/:id/spin/random", spinRandom);

export default router;
