import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/auth.routes.js";
import groupsRoutes from "./routes/groups.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";
import settlementsRoutes from "./routes/settlements.routes.js";
import contactsRoutes from "./routes/contacts.routes.js";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();
if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",").map(s=>s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb){
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.options("*", cors());

app.use(express.json());

app.get("/", (_req,res)=> res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/settlements", settlementsRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

const port = process.env.PORT || 8080;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(port, () => {
    console.log(`✅ Server on :${port}`);
    console.log("✅ Allowed origins:", allowedOrigins.join(", "));
  });
});
