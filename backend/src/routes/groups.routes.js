import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createGroup, myGroups, getGroup, joinGroup } from "../controllers/groups.controller.js";
const router = Router();
router.post("/", auth, createGroup);
router.get("/mine", auth, myGroups);
router.get("/:id", auth, getGroup);
router.post("/join", auth, joinGroup);
export default router;
