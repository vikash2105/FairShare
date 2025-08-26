import { Router } from "express";
import { createGroup, getGroup, joinGroup, myGroups } from "../controllers/groups.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/", createGroup);
r.post("/join", joinGroup);
r.get("/mine", myGroups);
r.get("/:id", getGroup);
export default r;
