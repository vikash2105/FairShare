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

const app = express();

// ✅ Global CORS - Moved to be the first middleware to handle preflight requests correctly
// Allowed origins: dev + prod
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "https://fairshare-lyart.vercel.app",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// This middleware is now placed after CORS.
// It parses incoming JSON requests and should be after any middleware that handles pre-request logic like CORS.
app.use(express.json());

// ✅ Handle preflight everywhere
app.options("*", cors());

app.get("/", (_req, res) =>
  res.json({ ok: true, service: "friends-bills-backend" })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api", spinsRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Always return CORS headers even on errors
app.use(errorHandler);

const port = process.env.PORT || 8080;
connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`✅ Server listening on http://localhost:${port}`)
    );
  })
  .catch((e) => {
    console.error("DB connection failed:", e);
    process.exit(1);
  });
