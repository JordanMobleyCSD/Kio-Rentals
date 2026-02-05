import { Link } from "react-router-dom";
import Badge from "./Badge.jsx";

export default function CarCard({ car }) {
  const photo = car.photos?.[0];
  return (
    <Link
      to={`/cars/${car.id}`}
      className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition"
    >
      <div className="aspect-[16/10] bg-slate-900 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={car.title}
            className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-slate-400">No photo</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold leading-snug">{car.title}</div>
            <div className="text-sm text-slate-300 mt-0.5">{car.city}, {car.state}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">${car.pricePerDay}</div>
            <div className="text-xs text-slate-300 -mt-0.5">/day</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{car.year}</Badge>
          <Badge>{car.seats} seats</Badge>
          <Badge>{car.transmission}</Badge>
          <Badge>★ {Number(car.rating).toFixed(2)}</Badge>
        </div>
      </div>
    </Link>
  );
}
