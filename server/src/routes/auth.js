import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getDb } from "../lib/db.js";
import { uid } from "../lib/id.js";
import { signToken, requireAuth } from "../lib/auth.js";
import { validate } from "../lib/validate.js";

export const authRouter = Router();

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
  })
});

authRouter.post("/register", validate(registerSchema), (req, res) => {
  const db = getDb();
  const { fullName, email, password } = req.validated.body;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: "Conflict", message: "Email already in use" });

  const passwordHash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();
  const id = uid("usr");

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email.toLowerCase(), passwordHash, fullName, now);

  const token = signToken({ id, email: email.toLowerCase(), fullName });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res.json({ token, user: { id, email: email.toLowerCase(), fullName } });
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

authRouter.post("/login", validate(loginSchema), (req, res) => {
  const db = getDb();
  const { email, password } = req.validated.body;

  const user = db.prepare("SELECT id, email, password_hash, full_name FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Unauthorized", message: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email, fullName: user.full_name });
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare("SELECT id, email, full_name FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "NotFound" });
  res.json({ user: { id: user.id, email: user.email, fullName: user.full_name } });
});
