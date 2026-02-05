import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api.js";
import CarCard from "../ui/CarCard.jsx";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Card from "../ui/Card.jsx";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const q = params.get("q") || "";
  const city = params.get("city") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const seats = params.get("seats") || "";
  const sort = params.get("sort") || "rating_desc";

  const queryObj = useMemo(() => {
    const o = {};
    if (q) o.q = q;
    if (city) o.city = city;
    if (min) o.min = min;
    if (max) o.max = max;
    if (seats) o.seats = seats;
    if (sort) o.sort = sort;
    return o;
  }, [q, city, min, max, seats, sort]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams(queryObj).toString();
        const r = await api.get(`/cars?${qs}`);
        setCars(r.cars || []);
      } catch (e) {
        setError(e.message || "Failed to load cars");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [queryObj]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Search</h2>
          <p className="text-slate-300 text-sm mt-1">Find cars by city, price, seats, and keyword.</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid md:grid-cols-5 gap-3">
          <Input label="Keyword" value={q} onChange={(e) => update("q", e.target.value)} placeholder="Tesla, Jeep..." />
          <Input label="City" value={city} onChange={(e) => update("city", e.target.value)} placeholder="Charlotte" />
          <Input label="Min / day" value={min} onChange={(e) => update("min", e.target.value)} placeholder="50" />
          <Input label="Max / day" value={max} onChange={(e) => update("max", e.target.value)} placeholder="150" />
          <Select label="Sort" value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="rating_desc">Top rated</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
          </Select>
        </div>
        <div className="mt-3">
          <Input label="Seats (min)" value={seats} onChange={(e) => update("seats", e.target.value)} placeholder="4" />
        </div>
      </Card>

      {loading && <div className="text-slate-300">Loading cars…</div>}
      {error && <div className="text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      )}

      {!loading && !error && cars.length === 0 && (
        <div className="text-slate-300">No cars found. Try another city or keyword.</div>
      )}
    </div>
  );
}
