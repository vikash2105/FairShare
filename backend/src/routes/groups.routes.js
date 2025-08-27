import { Router } from "express";
import {
  createGroup,
  getGroup,
  joinGroup,
  myGroups,
} from "../controllers/groups.controller.js";
import { requireAuth } from "../middleware/auth.js"; // ✅ fixed import

const router = Router();

// all group routes require authentication
router.use(requireAuth);

router.post("/", createGroup);
router.post("/join", joinGroup);
router.get("/mine", myGroups);
router.get("/:id", getGroup);

export default router;
