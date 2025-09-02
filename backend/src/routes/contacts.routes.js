import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { myContacts, inviteContact, acceptContact } from "../controllers/contacts.controller.js";
const router = Router();
router.get("/", auth, myContacts);
router.post("/invite", auth, inviteContact);
router.post("/accept", auth, acceptContact);
export default router;
