import { Router } from "express";
import { listSpins, spinRandom } from "../controllers/spins.controller.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.use(auth);

// GET /spins/:groupId  => list recent spins for group
router.get("/:groupId", listSpins);

// POST /spins/:groupId/random => do a random spin and save
router.post("/:groupId/random", spinRandom);

export default router;
