import { Router } from "express";
import { z } from "zod";
import { getDb } from "../lib/db.js";
import { uid } from "../lib/id.js";
import { requireAuth } from "../lib/auth.js";
import { validate } from "../lib/validate.js";

export const carsRouter = Router();

const listSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    city: z.string().optional(),
    min: z.coerce.number().optional(),
    max: z.coerce.number().optional(),
    seats: z.coerce.number().optional(),
    sort: z.enum(["price_asc", "price_desc", "rating_desc"]).optional()
  })
});

carsRouter.get("/", validate(listSchema), (req, res) => {
  const db = getDb();
  const { q, city, min, max, seats, sort } = req.validated.query;

  const where = [];
  const params = {};

  if (q) {
    where.push("(title LIKE @q OR make LIKE @q OR model LIKE @q)");
    params.q = `%${q}%`;
  }
  if (city) {
    where.push("city LIKE @city");
    params.city = `%${city}%`;
  }
  if (typeof min === "number") {
    where.push("price_per_day >= @min");
    params.min = min;
  }
  if (typeof max === "number") {
    where.push("price_per_day <= @max");
    params.max = max;
  }
  if (typeof seats === "number") {
    where.push("seats >= @seats");
    params.seats = seats;
  }

  const orderBy = (() => {
    if (sort === "price_asc") return "ORDER BY price_per_day ASC";
    if (sort === "price_desc") return "ORDER BY price_per_day DESC";
    if (sort === "rating_desc") return "ORDER BY rating DESC";
    return "ORDER BY created_at DESC";
  })();

  const sql = `
    SELECT id, owner_id, title, make, model, year, city, state, price_per_day, seats, transmission, fuel,
           rating, trips_count, description, features_json, photos_json, created_at, updated_at
    FROM cars
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ${orderBy}
    LIMIT 100
  `;

  const cars = db.prepare(sql).all(params).map(row => ({
    ...row,
    features: JSON.parse(row.features_json),
    photos: JSON.parse(row.photos_json),
    pricePerDay: row.price_per_day
  }));

  res.json({ cars });
});

const idSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

carsRouter.get("/:id", validate(idSchema), (req, res) => {
  const db = getDb();
  const { id } = req.validated.params;

  const row = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "NotFound", message: "Car not found" });

  const car = {
    ...row,
    features: JSON.parse(row.features_json),
    photos: JSON.parse(row.photos_json),
    pricePerDay: row.price_per_day
  };
  res.json({ car });
});

const createSchema = z.object({
  body: z.object({
    title: z.string().min(4),
    make: z.string().min(2),
    model: z.string().min(1),
    year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
    city: z.string().min(2),
    state: z.string().min(2).max(2),
    pricePerDay: z.coerce.number().int().min(10).max(2000),
    seats: z.coerce.number().int().min(2).max(12),
    transmission: z.enum(["Automatic", "Manual"]),
    fuel: z.enum(["Gas", "Diesel", "Hybrid", "EV"]),
    description: z.string().min(10),
    features: z.array(z.string()).default([]),
    photos: z.array(z.string().url()).default([])
  })
});

carsRouter.post("/", requireAuth, validate(createSchema), (req, res) => {
  const db = getDb();
  const b = req.validated.body;

  const now = new Date().toISOString();
  const id = uid("car");

  db.prepare(`
    INSERT INTO cars (id, owner_id, title, make, model, year, city, state, price_per_day, seats, transmission, fuel,
      rating, trips_count, description, features_json, photos_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.8, 0, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.user.id,
    b.title,
    b.make,
    b.model,
    b.year,
    b.city,
    b.state.toUpperCase(),
    b.pricePerDay,
    b.seats,
    b.transmission,
    b.fuel,
    b.description,
    JSON.stringify(b.features ?? []),
    JSON.stringify(b.photos ?? []),
    now,
    now
  );

  const row = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  res.status(201).json({
    car: {
      ...row,
      features: JSON.parse(row.features_json),
      photos: JSON.parse(row.photos_json),
      pricePerDay: row.price_per_day
    }
  });
});

const updateSchema = createSchema.extend({
  params: z.object({ id: z.string().min(1) })
});

carsRouter.put("/:id", requireAuth, validate(updateSchema), (req, res) => {
  const db = getDb();
  const { id } = req.validated.params;
  const b = req.validated.body;

  const existing = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "NotFound" });
  if (existing.owner_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  const now = new Date().toISOString();

  db.prepare(`
    UPDATE cars
    SET title = ?, make = ?, model = ?, year = ?, city = ?, state = ?, price_per_day = ?, seats = ?, transmission = ?, fuel = ?,
        description = ?, features_json = ?, photos_json = ?, updated_at = ?
    WHERE id = ?
  `).run(
    b.title, b.make, b.model, b.year, b.city, b.state.toUpperCase(), b.pricePerDay, b.seats, b.transmission, b.fuel,
    b.description, JSON.stringify(b.features ?? []), JSON.stringify(b.photos ?? []), now, id
  );

  const row = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  res.json({
    car: {
      ...row,
      features: JSON.parse(row.features_json),
      photos: JSON.parse(row.photos_json),
      pricePerDay: row.price_per_day
    }
  });
});

carsRouter.delete("/:id", requireAuth, validate(idSchema), (req, res) => {
  const db = getDb();
  const { id } = req.validated.params;

  const existing = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "NotFound" });
  if (existing.owner_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  db.prepare("DELETE FROM cars WHERE id = ?").run(id);
  res.json({ ok: true });
});
