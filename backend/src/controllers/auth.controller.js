import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signJwt } from "../utils/jwt.js";

export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name, isAnonymous: false });
    const token = signJwt({ id: user._id, email: user.email, name: user.name, isAnonymous: false }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name, isAnonymous: user.isAnonymous }});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = signJwt({ id: user._id, email: user.email, name: user.name, isAnonymous: user.isAnonymous }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, email: user.email, name: user.name, isAnonymous: user.isAnonymous }});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function anonymous(req, res) {
  try {
    const anonName = "Guest-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const user = await User.create({ name: anonName, isAnonymous: true });
    const token = signJwt({ id: user._id, name: user.name, isAnonymous: true }, process.env.JWT_SECRET);
    res.json({ token, user: { _id: user._id, name: user.name, isAnonymous: user.isAnonymous }});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function me(req, res) {
  try {
    res.json({ user: req.user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
