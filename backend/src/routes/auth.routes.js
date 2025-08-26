import { Router } from "express";
import { anonymous, me, signin, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.post("/signup", signup);
r.post("/signin", signin);
r.post("/anonymous", anonymous);
r.get("/me", requireAuth, me);
export default r;
