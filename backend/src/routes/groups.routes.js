import { Router } from "express";
import {
  createGroup,
  getGroup,
  joinGroup,
  myGroups,
} from "../controllers/groups.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// all group routes require authentication
router.use(authMiddleware);

router.post("/", createGroup);
router.post("/join", joinGroup);
router.get("/mine", myGroups);
router.get("/:id", getGroup);

export default router;
