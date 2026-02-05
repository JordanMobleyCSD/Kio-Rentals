import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { api } from "../utils/api.js";
import { setToken } from "../utils/auth.js";

export default function Signup() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/auth/register", { fullName, email, password });
      setToken(r.token);
      nav("/search");
    } catch (e2) {
      setError(e2.message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <p className="text-sm text-slate-300 mt-1">Start renting and hosting.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jordan Mobley" />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 8 characters" />
          {error && <div className="text-red-300 text-sm">{error}</div>}
          <Button className="w-full">Create account</Button>
        </form>

        <div className="text-sm text-slate-300 mt-4">
          Already have an account? <Link className="underline underline-offset-4 hover:text-white" to="/login">Log in</Link>
        </div>
      </Card>
    </div>
  );
}
