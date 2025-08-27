import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import spinsRoutes from "./routes/spins.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment variables");
}

const app = express();

// ✅ CORS allowlist (supports multiple origins via comma-separated string)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // allow tools/curl (no origin) or explicit allowlist
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api", spinsRoutes);   // /api/group/:id/spin(s)
app.use("/api/ai", aiRoutes);

// ✅ Error handler
app.use(errorHandler);

const port = process.env.PORT || 8080;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server listening on http://localhost:${port}`);
      console.log(`✅ Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((e) => {
    console.error("DB connection failed:", e);
    process.exit(1);
  });
