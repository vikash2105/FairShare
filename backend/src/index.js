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

// CORS with allowlist (supports comma-separated CLIENT_ORIGIN values)
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    // allow non-browser clients or same-origin
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

app.use(express.json());

// Mount routes (paths are coupled to the frontend)
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api", spinsRoutes);      // /api/group/:id/spin(s)
app.use("/api/ai", aiRoutes);

// Error handler last
app.use(errorHandler);

const port = process.env.PORT || 8080;

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server listening on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error("DB connection failed:", e);
    process.exit(1);
  });
