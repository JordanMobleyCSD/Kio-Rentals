import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("Charlotte");
  const nav = useNavigate();

  function goSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    nav(`/search?${params.toString()}`);
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-cyan-400/10">
        <div className="p-8 sm:p-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              Find the perfect car. <span className="text-cyan-300">Instantly.</span>
            </h1>
            <p className="text-slate-200 mt-4 leading-relaxed">
              A modern car-sharing demo inspired by Turo: search, book, and host. This is a clean starter you can extend into a real platform.
            </p>

            <form onSubmit={goSearch} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Where"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Charlotte"
              />
              <Input
                label="What"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tesla, Jeep, Camry..."
              />
              <div className="flex items-end">
                <Button className="w-full">Search cars</Button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/host" className="text-sm text-slate-100 underline underline-offset-4 hover:text-white">
                Become a host
              </Link>
              <Link to="/search?city=Charlotte&sort=rating_desc" className="text-sm text-slate-100 underline underline-offset-4 hover:text-white">
                Top rated
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-lg font-semibold">Insurance-ready flow</div>
          <p className="text-sm text-slate-300 mt-2">Add protection plans + driver verification later. Routes are already organized for it.</p>
        </Card>
        <Card className="p-5">
          <div className="text-lg font-semibold">Fast search UX</div>
          <p className="text-sm text-slate-300 mt-2">Filter by city, price, seats, and keyword. Extend with maps and distance ranking.</p>
        </Card>
        <Card className="p-5">
          <div className="text-lg font-semibold">Host dashboard</div>
          <p className="text-sm text-slate-300 mt-2">Create listings (auth). Add availability calendar + photo uploads next.</p>
        </Card>
      </section>
    </div>
  );
}
