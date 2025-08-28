import { Router } from "express";
import {
  signup,
  signin,
  verifyOtp,
  resendOtp,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

// --- OTP routes ---
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
