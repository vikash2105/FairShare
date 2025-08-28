import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

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

// ✅ helper to send OTP email (using SendGrid SMTP settings in .env)
async function sendOtpMail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // smtp.sendgrid.net
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER, // usually "apikey"
      pass: process.env.SMTP_PASS, // your SendGrid API key
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@fairshare.com",
    to: email,
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

    res.status(201).json({
      requiresVerification: true,
      message: "OTP sent to your email",
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

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Account not verified. Please verify OTP first." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = signToken(user);
    res.json({
      user: { ...user.toObject(), password: undefined, otpHash: undefined },
      token,
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

    res.json({ success: true, message: "Account verified. Please sign in." });
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

    res.json({ success: true, message: "New OTP sent" });
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
