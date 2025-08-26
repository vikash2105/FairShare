import { Router } from "express";
import { history, spin } from "../controllers/spins.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.use(requireAuth);
r.post("/group/:id/spin", spin);
r.get("/group/:id/spins", history);
export default r;
