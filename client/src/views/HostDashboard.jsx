import { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { api } from "../utils/api.js";
import { getToken } from "../utils/auth.js";
import { Link } from "react-router-dom";

export default function HostDashboard() {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    make: "",
    model: "",
    year: "2022",
    city: "Charlotte",
    state: "NC",
    pricePerDay: "99",
    seats: "5",
    transmission: "Automatic",
    fuel: "Gas",
    description: "",
    features: "Bluetooth, Backup Camera",
    photos: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80",
  });

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function createListing(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!getToken()) {
      setError("Please log in first to create a listing.");
      return;
    }

    const payload = {
      ...form,
      year: Number(form.year),
      pricePerDay: Number(form.pricePerDay),
      seats: Number(form.seats),
      features: form.features.split(",").map(s => s.trim()).filter(Boolean),
      photos: form.photos.split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      const r = await api.post("/cars", payload);
      setMsg(`Listing created: ${r.car.title}`);
      setForm(prev => ({ ...prev, title: "", make: "", model: "", description: "" }));
    } catch (e2) {
      setError(e2.message);
    }
  }

  if (!getToken()) {
    return (
      <Card className="p-6">
        <div className="text-lg font-semibold">Host Dashboard</div>
        <p className="text-slate-300 mt-2">Log in to create listings (demo).</p>
        <div className="mt-4">
          <Button as={Link} to="/login">Log in</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Host Dashboard</h2>
        <p className="text-sm text-slate-300 mt-1">Create a car listing (demo). Next step: availability + photos upload.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={createListing} className="grid md:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="2022 BMW 3 Series" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Make" value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="BMW" />
            <Input label="Model" value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="330i" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Year" value={form.year} onChange={(e) => set("year", e.target.value)} />
            <Input label="Seats" value={form.seats} onChange={(e) => set("seats", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
            <Input label="State" value={form.state} onChange={(e) => set("state", e.target.value)} hint="2-letter code" />
          </div>
          <Input label="Price per day" value={form.pricePerDay} onChange={(e) => set("pricePerDay", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Transmission" value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
              <option>Automatic</option>
              <option>Manual</option>
            </Select>
            <Select label="Fuel" value={form.fuel} onChange={(e) => set("fuel", e.target.value)}>
              <option>Gas</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>EV</option>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Tell renters what makes your car special…"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Features (comma-separated)"
              value={form.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="Bluetooth, Apple CarPlay, Heated Seats"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Photo URLs (comma-separated)"
              value={form.photos}
              onChange={(e) => set("photos", e.target.value)}
              placeholder="https://… , https://…"
            />
          </div>

          {error && <div className="md:col-span-2 text-red-300 text-sm">{error}</div>}
          {msg && <div className="md:col-span-2 text-emerald-200 text-sm">{msg}</div>}

          <div className="md:col-span-2">
            <Button className="w-full">Create listing</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
