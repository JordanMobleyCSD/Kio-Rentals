import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { getToken, clearToken } from "../utils/auth.js";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-full text-sm font-medium transition
       ${isActive ? "bg-black/5 text-ink" : "text-black/70 hover:bg-black/5 hover:text-ink"}`
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-black" />
            <div className="leading-tight">
              <div className="font-semibold">KioRentals</div>
              <div className="text-xs text-black/60 -mt-0.5">Simple car sharing</div>
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
                <div className="hidden sm:block text-sm text-black/70">
                  Hi, <span className="font-medium text-ink">{me.fullName}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-full text-sm bg-black/5 hover:bg-black/10 border border-line"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-full text-sm bg-black/5 hover:bg-black/10 border border-line"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-full text-sm font-semibold text-white bg-accent hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="md:hidden border-t border-line">
          <div className="mx-auto max-w-6xl px-2 py-2 flex items-center gap-1">
            <NavItem to="/search">Search</NavItem>
            <NavItem to="/trips">Trips</NavItem>
            <NavItem to="/host">Host</NavItem>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-black/60 flex flex-col sm:flex-row gap-3 justify-between">
          <div>© {new Date().getFullYear()} KioRentals — Demo</div>
          <div className="flex gap-4">
            <a href="https://render.com" target="_blank" rel="noreferrer">Render</a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>
            <a href="https://expressjs.com" target="_blank" rel="noreferrer">Express</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
