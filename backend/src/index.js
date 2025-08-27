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

// ✅ Allowed origins: from env OR fallback
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",               // local dev
      "http://localhost:3000",               // (in case of CRA/Next)
      "https://fairshare-lyart.vercel.app",  // deployed frontend
    ];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS request from:", origin); // 🔍 debug

    // allow REST tools (Postman/curl) with no origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options("*", cors(corsOptions));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Health check route
app.get("/", (_req, res) =>
  res.json({ ok: true, service: "friends-bills-backend" })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api", spinsRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Error handler (always last)
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
