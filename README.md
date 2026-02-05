# KioRentals (Car Rental Demo) — React + Express (Render-ready)

A full-stack demo car-rental platform scaffold (Turo-style): browse listings, view details, create bookings, basic auth, and a simple host dashboard.

## Tech
- Frontend: **React (Vite)** + React Router + Tailwind
- Backend: **Node.js (Express)** + SQLite (better-sqlite3) + JWT auth
- Hosting: **Render** (single web service). The Express server serves the built React app from `server/public`.

> This is a demo skeleton you can extend (payments, messaging, reviews, availability calendars, insurance, etc.).

---

## Local Setup

### 1) Install
```bash
npm install
```

### 2) Run in dev (client + server)
```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:3000/api

### 3) Build for production (client -> server/public)
```bash
npm run build
npm start
```
Server: http://localhost:3000

---

## Environment Variables
Create `server/.env` (or set these in Render):

```bash
NODE_ENV=development
PORT=3000
JWT_SECRET=change_me_in_render
DB_PATH=./data/app.db
CORS_ORIGIN=http://localhost:5173
```

---

## Render Deploy (Recommended)
This repo includes a `render.yaml` blueprint.

1. Push to GitHub
2. In Render: **New > Blueprint** and select your repo
3. Render will:
   - install dependencies
   - build the React app into `server/public`
   - start the Express server

If you deploy manually as a Web Service:
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

---

## API Overview

Base: `/api`

### Cars
- `GET /cars` — list cars (supports `?q=`, `?city=`, `?min=`, `?max=`, `?seats=`, `?sort=price_asc|price_desc|rating_desc`)
- `GET /cars/:id` — car details
- `POST /cars` — create a car listing (auth required)
- `PUT /cars/:id` — update listing (auth required)
- `DELETE /cars/:id` — delete listing (auth required)

### Bookings
- `POST /bookings` — create booking (auth required)
- `GET /bookings/me` — current user's bookings (auth required)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (auth required)

---

## Notes / Next Features
- Payments (Stripe), host payouts, escrow
- Availability calendar + iCal sync
- Messaging + notifications
- Damage protection plans, add-ons
- Reviews/ratings moderation
- Admin panel
- Image uploads + CDN storage (S3/R2)
- Search ranking, geolocation, maps

Enjoy — build it out into your Turo rival.
