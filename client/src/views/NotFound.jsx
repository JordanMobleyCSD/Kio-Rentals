import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl font-semibold">404</div>
      <div className="text-slate-300 mt-2">That page doesn’t exist.</div>
      <div className="mt-6">
        <Button as={Link} to="/">Go home</Button>
      </div>
    </div>
  );
}
