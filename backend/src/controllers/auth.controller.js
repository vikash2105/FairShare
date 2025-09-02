import jwt from "jsonwebtoken";
import User from "../models/User.js";

function sign(user){
  return jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function signup(req,res,next){
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });
    const user = await User.create({ name, email, password });
    const token = sign(user);
    res.json({ token, user });
  } catch(e){ next(e); }
}

export async function signin(req,res,next){
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.compare(password))) return res.status(400).json({ error: "Invalid credentials" });
    const token = sign(user);
    res.json({ token, user });
  } catch(e){ next(e); }
}

export async function me(req,res,next){
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch(e){ next(e); }
}
