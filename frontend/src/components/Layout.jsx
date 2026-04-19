import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/App";
import { LogOut } from "lucide-react";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/orders", label: "New Order" },
    { to: "/orders/history", label: "Order History" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2927] relative overflow-x-hidden">
      <div className="blob" style={{ width: 500, height: 500, top: -150, right: -150, background: "#E8C4C4" }} />
      <div className="blob" style={{ width: 400, height: 400, bottom: -100, left: -100, background: "#C4D4CD" }} />

      <nav
        data-testid="main-nav"
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FAF8F5]/80 border-b border-[#EAE4DC]/60"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-heading text-2xl md:text-3xl tracking-tight"
            data-testid="nav-brand"
          >
            bloom<span className="italic font-light text-[#E8C4C4]">.</span>bakery
          </div>
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors ${
                    isActive ? "text-[#2C2927]" : "text-[#7E756D] hover:text-[#2C2927]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-[#EAE4DC]"
              />
            )}
            <span className="hidden sm:block text-sm text-[#3A3532]">{user?.name?.split(" ")[0]}</span>
            <button
              data-testid="logout-btn"
              onClick={logout}
              className="p-2 rounded-full hover:bg-[#F4EBE6] transition-colors"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <motion.main
        key={window.location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pt-28 relative z-10"
      >
        <Outlet />
      </motion.main>

      <footer className="relative z-10 border-t border-[#EAE4DC]/60 mt-24 py-10 text-center text-sm text-[#A39B93]">
        <span className="font-heading italic text-lg">bloom bakery</span> — crafted with soft flour & softer light
      </footer>
    </div>
  );
}
