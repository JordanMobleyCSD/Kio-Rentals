import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { initDb, getDb } from "./lib/db.js";
import { uid } from "./lib/id.js";

dotenv.config();
initDb();
const db = getDb();

function upsertUser() {
  const email = "demo@kiorentals.com";
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return existing.id;

  const id = uid("usr");
  const now = new Date().toISOString();
  const pw = bcrypt.hashSync("password123", 10);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, email, pw, "Demo User", now);

  return id;
}

function seedCars(ownerId) {
  const count = db.prepare("SELECT COUNT(*) as n FROM cars").get().n;
  if (count > 0) return;

  const now = new Date().toISOString();

  const cars = [
    {
      title: "2023 Tesla Model Y Long Range",
      make: "Tesla", model: "Model Y", year: 2023,
      city: "Charlotte", state: "NC",
      pricePerDay: 119, seats: 5, transmission: "Automatic", fuel: "EV",
      rating: 4.95, tripsCount: 128,
      description: "Clean, fast, and perfect for city driving or weekend trips. Includes phone key + Supercharging.",
      features: ["Unlimited Miles (promo)", "Autopilot", "Heated Seats", "Phone Mount", "All-Weather Mats"],
      photos: [
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1617653695386-1e0f15ef8bcb?auto=format&fit=crop&w=1600&q=80"
      ]
    },
    {
      title: "2022 Jeep Wrangler Rubicon 4x4",
      make: "Jeep", model: "Wrangler", year: 2022,
      city: "Charlotte", state: "NC",
      pricePerDay: 145, seats: 5, transmission: "Automatic", fuel: "Gas",
      rating: 4.88, tripsCount: 76,
      description: "Trail-ready Rubicon with removable top. Great for mountains, beach, and everything in-between.",
      features: ["4x4", "Off-Road Tires", "Bluetooth", "Backup Camera", "Unlimited Weekend Miles"],
      photos: [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80"
      ]
    },
    {
      title: "2021 Toyota Camry SE",
      make: "Toyota", model: "Camry", year: 2021,
      city: "Concord", state: "NC",
      pricePerDay: 69, seats: 5, transmission: "Automatic", fuel: "Gas",
      rating: 4.82, tripsCount: 211,
      description: "Reliable daily driver with great MPG. Perfect for errands, commutes, or airport runs.",
      features: ["Great MPG", "Apple CarPlay", "Blind Spot Monitor", "Cruise Control"],
      photos: [
        "https://images.unsplash.com/photo-1618843479313-40f0d34e55a4?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80"
      ]
    },
    {
      title: "2020 Mercedes-Benz GLC 300",
      make: "Mercedes-Benz", model: "GLC 300", year: 2020,
      city: "Gastonia", state: "NC",
      pricePerDay: 109, seats: 5, transmission: "Automatic", fuel: "Gas",
      rating: 4.90, tripsCount: 54,
      description: "Luxury SUV with premium interior and smooth ride. Great for events and date nights.",
      features: ["Leather Seats", "Panoramic Roof", "Premium Audio", "Ambient Lighting"],
      photos: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80"
      ]
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO cars (id, owner_id, title, make, model, year, city, state, price_per_day, seats, transmission, fuel,
      rating, trips_count, description, features_json, photos_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of cars) {
    stmt.run(
      uid("car"),
      ownerId,
      c.title,
      c.make,
      c.model,
      c.year,
      c.city,
      c.state,
      c.pricePerDay,
      c.seats,
      c.transmission,
      c.fuel,
      c.rating,
      c.tripsCount,
      c.description,
      JSON.stringify(c.features),
      JSON.stringify(c.photos),
      now,
      now
    );
  }
}

const ownerId = upsertUser();
seedCars(ownerId);

console.log("Seed complete.");
console.log("Demo login -> email: demo@kiorentals.com | password: password123");
