import { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import { api } from "../utils/api.js";
import { getToken } from "../utils/auth.js";
import Button from "../ui/Button.jsx";
import { Link } from "react-router-dom";

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const r = await api.get("/bookings/me");
        setBookings(r.bookings || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!getToken()) {
    return (
      <Card className="p-6">
        <div className="text-lg font-semibold">Trips</div>
        <p className="text-slate-300 mt-2">Log in to see your bookings.</p>
        <div className="mt-4">
          <Button as={Link} to="/login">Log in</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Trips</h2>
        <p className="text-sm text-slate-300 mt-1">Your booking requests.</p>
      </div>

      {loading && <div className="text-slate-300">Loading…</div>}
      {error && <div className="text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <Card key={b.id} className="p-5 flex gap-4 items-center justify-between flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-16 w-24 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                  {b.car.photos?.[0] ? <img alt="" src={b.car.photos[0]} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <div className="font-semibold">{b.car.title}</div>
                  <div className="text-sm text-slate-300">{b.startDate} → {b.endDate} • {b.status}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">${b.totalPrice}</div>
                <div className="text-xs text-slate-300">total</div>
              </div>
            </Card>
          ))}
          {bookings.length === 0 && (
            <div className="text-slate-300">No bookings yet. Go find a car.</div>
          )}
        </div>
      )}
    </div>
  );
}
