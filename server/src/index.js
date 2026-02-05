import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { initDb } from "./lib/db.js";
import { apiRouter } from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB init
initDb();

// Middleware
app.use(helmet({
  // allow Vite dev websocket in dev; keep default in prod
  contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS for dev; in production we serve same origin (Render), so allow empty or self
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
  origin: corsOrigin && corsOrigin.length ? corsOrigin : true,
  credentials: true
}));

app.get("/api/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// API
app.use("/api", apiRouter);

// --- Static + SPA fallback (React Router) ---
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// Anything not /api and not a static file -> index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(publicDir, "index.html"), (err) => {
    if (err) next();
  });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: "ServerError",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
