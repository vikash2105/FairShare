import { Router } from "express";
import { signup, signin, anonymous, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/anonymous", anonymous);
router.get("/me", requireAuth, me);

export default router;
