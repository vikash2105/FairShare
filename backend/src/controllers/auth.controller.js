import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SMTP_PASS); // ✅ SendGrid API key

// ✅ helper to sign a JWT
function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ✅ helper to send OTP email using SendGrid
async function sendOtpMail(email, otp) {
  await sgMail.send({
    to: email,
    from: process.env.SMTP_FROM, // must be verified sender in SendGrid
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
  });
}

// ------------------- SIGNUP -------------------
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
    const user = new User({
      name,
      email,
      password: hashed,
      isVerified: false,
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otpHash = otpHash;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendOtpMail(email, otp);

    const token = signToken(user);
    res.status(201).json({
      user: { ...user.toObject(), password: undefined, otpHash: undefined },
      token,
      requiresVerification: true,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------- SIGNIN -------------------
export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({
      user: { ...user.toObject(), password: undefined, otpHash: undefined },
      token,
      requiresVerification: !user.isVerified,
    });
  } catch (err) {
    next(err);
  }
}

// ------------------- VERIFY OTP -------------------
export async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.otpHash || !user.otpExpiry)
      return res.status(400).json({ error: "No OTP found" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ error: "OTP expired" });

    const match = await bcrypt.compare(otp, user.otpHash);
    if (!match) return res.status(400).json({ error: "Invalid OTP" });

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ------------------- RESEND OTP -------------------
export async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpHash = await bcrypt.hash(otp, 10);
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpMail(email, otp);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ------------------- ME -------------------
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -otpHash")
      .lean();
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
