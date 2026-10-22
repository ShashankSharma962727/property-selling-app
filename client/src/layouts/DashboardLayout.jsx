import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const sidebarLinkClass = ({ isActive }) =>
  [
    "rounded-sm px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-navy-800 text-amber-500"
      : "text-cream-50/75 hover:bg-navy-800 hover:text-cream-50",
  ].join(" ");

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />
      <div className="flex w-full max-w-6xl flex-1 flex-col lg:flex-row">
        <aside className="border-b border-cream-200 bg-navy-950 lg:w-60 lg:border-r lg:border-b-0 lg:border-cream-200">
          <p className="px-4 pt-5 pb-2 text-[0.65rem] tracking-[0.2em] text-amber-500 uppercase">
            Dashboard
          </p>
          <nav
            className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible"
            aria-label="Dashboard"
          >
            <NavLink to="/dashboard" end className={sidebarLinkClass}>
              Overview
            </NavLink>
            <NavLink to="/dashboard/listings" className={sidebarLinkClass}>
              My listings
            </NavLink>
            <NavLink to="/dashboard/properties/new" className={sidebarLinkClass}>
              Add property
            </NavLink>
            <NavLink to="/dashboard/profile" className={sidebarLinkClass}>
              Profile
            </NavLink>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
