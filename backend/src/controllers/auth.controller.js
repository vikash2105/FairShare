import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ helper to sign a JWT
function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      isAnonymous: user.isAnonymous || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken(user);
    res.status(201).json({ user: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    next(err);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken(user);
    res.json({ user: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    next(err);
  }
}

export async function anonymous(req, res, next) {
  try {
    const user = await User.create({
      name: "Anonymous",
      email: `anon_${Date.now()}@example.com`,
      isAnonymous: true,
    });
    const token = signToken(user);
    res.json({ user: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
