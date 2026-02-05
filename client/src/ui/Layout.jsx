import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { getToken, clearToken } from "../utils/auth.js";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-lg text-sm font-medium tracking-wide transition
       ${isActive
         ? "bg-gold-500/10 text-gold-200 ring-1 ring-gold-500/20"
         : "text-slate-200 hover:bg-white/5 hover:text-white"}`
    }
  >
    {children}
  </NavLink>
);

export default function Layout() {
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    async function loadMe() {
      const token = getToken();
      if (!token) return setMe(null);
      const r = await api.get("/auth/me");
      setMe(r.user ?? null);
    }
    loadMe();
  }, []);

  async function logout() {
    try { await api.post("/auth/logout", {}); } catch { /* ignore */ }
    clearToken();
    setMe(null);
    nav("/");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 backdrop-blur bg-ink-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_0_1px_rgba(245,158,11,.35)]" />
            <div className="leading-tight">
              <div className="font-semibold tracking-[0.02em]">KioRentals</div>
              <div className="text-xs text-slate-300 -mt-0.5">Luxury peer-to-peer rentals</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/search">Search</NavItem>
            <NavItem to="/trips">Trips</NavItem>
            <NavItem to="/host">Host</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            {me ? (
              <>
                <div className="hidden sm:block text-sm text-slate-200">
                  Welcome, <span className="font-medium text-gold-200">{me.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-ink-950
                             bg-gradient-to-r from-gold-400 to-gold-600 hover:opacity-95 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto max-w-6xl px-2 py-2 flex items-center gap-1">
            <NavItem to="/search">Search</NavItem>
            <NavItem to="/trips">Trips</NavItem>
            <NavItem to="/host">Host</NavItem>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-300 flex flex-col sm:flex-row gap-3 justify-between">
          <div>© {new Date().getFullYear()} KioRentals — Demo</div>
          <div className="flex gap-4">
            <a className="hover:text-gold-200" href="https://render.com" target="_blank" rel="noreferrer">Render</a>
            <a className="hover:text-gold-200" href="https://react.dev" target="_blank" rel="noreferrer">React</a>
            <a className="hover:text-gold-200" href="https://expressjs.com" target="_blank" rel="noreferrer">Express</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
