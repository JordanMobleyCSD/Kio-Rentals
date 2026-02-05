import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../utils/api.js";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import { getToken } from "../utils/auth.js";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(todayPlus(1));
  const [endDate, setEndDate] = useState(todayPlus(3));
  const [bookingMsg, setBookingMsg] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const r = await api.get(`/cars/${id}`);
        setCar(r.car);
      } catch (e) {
        setError(e.message || "Failed to load car");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function book() {
    setBookingMsg("");
    if (!getToken()) {
      setBookingMsg("Please log in first to request a booking.");
      return;
    }
    try {
      const r = await api.post("/bookings", { carId: id, startDate, endDate });
      setBookingMsg(`Booking requested! Total: $${r.booking.totalPrice}`);
    } catch (e) {
      setBookingMsg(e.message);
    }
  }

  if (loading) return <div className="text-slate-300">Loading…</div>;
  if (error) return <div className="text-red-300">{error}</div>;
  if (!car) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-300">
            <Link className="underline underline-offset-4 hover:text-white" to="/search">Search</Link>
            <span className="mx-2">/</span>
            <span>{car.make} {car.model}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-1">{car.title}</h2>
          <div className="text-slate-300 mt-1">{car.city}, {car.state} • ★ {Number(car.rating).toFixed(2)} • {car.trips_count ?? car.tripsCount} trips</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold">${car.pricePerDay}</div>
          <div className="text-sm text-slate-300 -mt-1">per day</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="grid sm:grid-cols-2">
              {(car.photos?.length ? car.photos : [null, null]).slice(0, 2).map((p, idx) => (
                <div key={idx} className="aspect-[16/11] bg-slate-900">
                  {p ? <img src={p} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center text-slate-400">No photo</div>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-wrap gap-2">
              <Badge>{car.year}</Badge>
              <Badge>{car.seats} seats</Badge>
              <Badge>{car.transmission}</Badge>
              <Badge>{car.fuel}</Badge>
            </div>
            <p className="text-slate-200 mt-4 leading-relaxed">{car.description}</p>

            <div className="mt-4">
              <div className="font-semibold">Features</div>
              <ul className="mt-2 grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
                {(car.features || []).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 sticky top-28">
            <div className="text-lg font-semibold">Request to book</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Input type="date" label="Start" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="date" label="End" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            <Button onClick={book} className="w-full mt-4">Request booking</Button>

            {bookingMsg && (
              <div className="mt-3 text-sm text-slate-200 bg-white/5 border border-white/10 rounded-lg p-3">
                {bookingMsg}
              </div>
            )}

            {!getToken() && (
              <div className="mt-3 text-xs text-slate-400">
                Demo login: <span className="text-slate-200">demo@kiorentals.com</span> / <span className="text-slate-200">password123</span>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
