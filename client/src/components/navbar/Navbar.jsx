
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import api from "../../API/api";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-sm px-1 py-1 text-sm tracking-wide transition-colors",
    isActive
      ? "text-amber-500"
      : "text-cream-50/80 hover:text-cream-50",
  ].join(" ");

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { isLoggedin, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await api.get("/api/v1/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(
        "Logout API error:",
        error.response?.data?.message || error.message
      );
    } finally {
      // Clear local authentication state
      logout();
      setOpen(false);
      setLoggingOut(false);
      navigate("/login");
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="border-b border-navy-800 bg-navy-950 text-cream-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-baseline gap-2"
        >
          <span className="font-serif text-xl tracking-tight">
            Haven
          </span>

          <span className="hidden text-[0.65rem] tracking-[0.2em] text-amber-500 uppercase sm:inline">
            Estates
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/properties" className={navLinkClass}>
            Browse
          </NavLink>

          {isLoggedin && (
            <NavLink
              to="/dashboard/properties/new"
              className={navLinkClass}
            >
              List a property
            </NavLink>
          )}
        </nav>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedin ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-2 py-1 text-sm text-cream-50/80 hover:text-cream-50 disabled:opacity-50"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-2 py-1 text-sm text-cream-50/80 hover:text-cream-50"
              >
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className="border border-amber-500 px-3 py-1.5 text-sm text-amber-500 hover:bg-amber-500 hover:text-navy-950"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-navy-700 text-cream-50 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-5 bg-cream-50 transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-cream-50 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-cream-50 transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile navigation */}
      {open && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-3 border-t border-navy-800 px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/properties"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Browse
          </NavLink>

          {isLoggedin ? (
            <>
              <NavLink
                to="/dashboard/properties/new"
                className={navLinkClass}
                onClick={closeMenu}
              >
                List a property
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-1 py-1 text-left text-sm text-cream-50/80 hover:text-cream-50 disabled:opacity-50"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Sign in
              </NavLink>

              <NavLink
                to="/register"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
