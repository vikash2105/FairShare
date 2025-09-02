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
import balancesRoutes from "./routes/balances.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Healthcheck
app.get("/", (_req, res) => res.json({ status: "ok" }));

// Mount routes
app.use("/auth", authRoutes);
app.use("/groups", groupsRoutes);
app.use("/expenses", expensesRoutes);
app.use("/spins", spinsRoutes);
app.use("/ai", aiRoutes);
app.use("/balances", balancesRoutes);

// Error handler
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
