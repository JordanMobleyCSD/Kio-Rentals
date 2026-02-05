import { Router } from "express";
import { z } from "zod";
import { getDb } from "../lib/db.js";
import { uid } from "../lib/id.js";
import { requireAuth } from "../lib/auth.js";
import { validate } from "../lib/validate.js";

export const bookingsRouter = Router();

const createSchema = z.object({
  body: z.object({
    carId: z.string().min(1),
    startDate: z.string().min(10), // ISO date
    endDate: z.string().min(10)    // ISO date
  })
});

function daysBetween(startIso, endIso) {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const ms = e.getTime() - s.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

// Very simple overlap check
function hasOverlap(db, carId, startDate, endDate) {
  const rows = db.prepare(`
    SELECT 1 FROM bookings
    WHERE car_id = ?
      AND status IN ('requested','confirmed')
      AND NOT (date(end_date) <= date(?) OR date(start_date) >= date(?))
    LIMIT 1
  `).all(carId, startDate, endDate);
  return rows.length > 0;
}

bookingsRouter.post("/", requireAuth, validate(createSchema), (req, res) => {
  const db = getDb();
  const { carId, startDate, endDate } = req.validated.body;

  const car = db.prepare("SELECT id, price_per_day FROM cars WHERE id = ?").get(carId);
  if (!car) return res.status(404).json({ error: "NotFound", message: "Car not found" });

  if (hasOverlap(db, carId, startDate, endDate)) {
    return res.status(409).json({ error: "Conflict", message: "Car not available for these dates" });
  }

  const d = daysBetween(startDate, endDate);
  const total = d * car.price_per_day;

  const id = uid("bkg");
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO bookings (id, car_id, renter_id, start_date, end_date, total_price, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'requested', ?)
  `).run(id, carId, req.user.id, startDate, endDate, total, now);

  const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
  res.status(201).json({
    booking: {
      ...booking,
      carId: booking.car_id,
      renterId: booking.renter_id,
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalPrice: booking.total_price
    }
  });
});

bookingsRouter.get("/me", requireAuth, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT b.*, c.title, c.make, c.model, c.year, c.city, c.state, c.photos_json
    FROM bookings b
    JOIN cars c ON c.id = b.car_id
    WHERE b.renter_id = ?
    ORDER BY b.created_at DESC
    LIMIT 200
  `).all(req.user.id);

  const bookings = rows.map(r => ({
    id: r.id,
    carId: r.car_id,
    renterId: r.renter_id,
    startDate: r.start_date,
    endDate: r.end_date,
    totalPrice: r.total_price,
    status: r.status,
    createdAt: r.created_at,
    car: {
      title: r.title,
      make: r.make,
      model: r.model,
      year: r.year,
      city: r.city,
      state: r.state,
      photos: JSON.parse(r.photos_json)
    }
  }));

  res.json({ bookings });
});
