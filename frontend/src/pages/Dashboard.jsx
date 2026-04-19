import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API, useAuth } from "@/App";
import { ArrowUpRight, Cake, ShoppingBag, ScrollText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [p, o] = await Promise.all([axios.get(`${API}/products`), axios.get(`${API}/orders`)]);
        setStats({
          products: p.data.length,
          orders: o.data.length,
          revenue: o.data.reduce((s, x) => s + (x.total || 0), 0),
        });
      } catch {}
    })();
  }, []);

  const cards = [
    { to: "/products", label: "Products", icon: Cake, count: stats.products, hint: "your catalogue" },
    { to: "/orders", label: "New Order", icon: ShoppingBag, count: "→", hint: "take an order" },
    { to: "/orders/history", label: "Order History", icon: ScrollText, count: stats.orders, hint: "past orders" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overline mb-4">Good morning, baker</div>
        <h1 className="font-heading text-5xl md:text-7xl leading-[1] tracking-tight">
          Hello, <span className="italic">{user?.name?.split(" ")[0]}</span>.
        </h1>
        <p className="mt-6 text-[#7E756D] max-w-xl">
          Your studio is quiet and ready. Here is a gentle summary of the day.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mt-16" data-testid="dashboard-cards">
        {cards.map((c, i) => (
          <motion.div
            key={c.to}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={c.to} data-testid={`dash-card-${c.label.toLowerCase().replace(/\s/g, "-")}`} className="card-bloom p-8 block group">
              <div className="flex items-start justify-between mb-10">
                <c.icon className="text-[#3A3532]" size={28} strokeWidth={1.3} />
                <ArrowUpRight className="text-[#A39B93] group-hover:text-[#2C2927] transition" size={20} />
              </div>
              <div className="overline mb-2">{c.hint}</div>
              <div className="flex items-baseline justify-between">
                <div className="font-heading text-4xl">{c.label}</div>
                <div className="font-heading text-5xl italic text-[#E8C4C4]">{c.count}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="mt-16 rounded-[2rem] bg-[#F4EBE6] p-10 md:p-16 flex flex-wrap items-center justify-between gap-8"
      >
        <div>
          <div className="overline mb-3">A tender metric</div>
          <div className="font-heading text-4xl md:text-5xl">Lifetime revenue</div>
        </div>
        <div className="font-heading text-6xl md:text-8xl italic" data-testid="lifetime-revenue">
          ₹{stats.revenue.toFixed(2)}
        </div>
      </motion.div>
    </div>
  );
}
