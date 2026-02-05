import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db;

export function getDb() {
  if (!db) throw new Error("DB not initialized. Call initDb() first.");
  return db;
}

export function initDb() {
  if (db) return db;

  const dbPath = process.env.DB_PATH || "./data/app.db";
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(dbPath);

  // Pragmas for safer defaults
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      price_per_day INTEGER NOT NULL,
      seats INTEGER NOT NULL,
      transmission TEXT NOT NULL,
      fuel TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 4.8,
      trips_count INTEGER NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      features_json TEXT NOT NULL,
      photos_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      car_id TEXT NOT NULL,
      renter_id TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      total_price INTEGER NOT NULL,
      status TEXT NOT NULL, -- requested|confirmed|cancelled|completed
      created_at TEXT NOT NULL,
      FOREIGN KEY(car_id) REFERENCES cars(id) ON DELETE CASCADE,
      FOREIGN KEY(renter_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_cars_city ON cars(city);
    CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_car ON bookings(car_id);
  `);

  return db;
}
