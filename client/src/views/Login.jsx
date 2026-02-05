import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { api } from "../utils/api.js";
import { setToken } from "../utils/auth.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("demo@kiorentals.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/auth/login", { email, password });
      setToken(r.token);
      nav("/search");
    } catch (e2) {
      setError(e2.message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Log in</h2>
        <p className="text-sm text-slate-300 mt-1">Welcome back.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <Button className="w-full">Continue</Button>
        </form>

        <div className="text-sm text-slate-300 mt-4">
          No account? <Link className="underline underline-offset-4 hover:text-white" to="/signup">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
