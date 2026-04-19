import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import { useEffect } from "react";

const heroImg = "https://images.pexels.com/photos/880639/pexels-photo-880639.jpeg";
const prod1 = "https://images.unsplash.com/photo-1672518478295-0e684ead1483?crop=entropy&cs=srgb&fm=jpg&q=85&w=900";
const prod2 = "https://images.pexels.com/photos/4828370/pexels-photo-4828370.jpeg?auto=compress&w=900";
const prod3 = "https://images.pexels.com/photos/28487961/pexels-photo-28487961.jpeg?auto=compress&w=900";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2927] relative overflow-x-hidden">
      <div className="blob animate-float-slow" style={{ width: 600, height: 600, top: -200, right: -200, background: "#E8C4C4" }} />
      <div className="blob animate-float-slow" style={{ width: 500, height: 500, bottom: -100, left: -150, background: "#D6CDDF" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FAF8F5]/70 border-b border-[#EAE4DC]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="font-heading text-2xl md:text-3xl tracking-tight" data-testid="landing-brand">
            bloom<span className="italic font-light text-[#E8C4C4]">.</span>bakery
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm tracking-wide text-[#7E756D]">
            <a href="#story" className="hover:text-[#2C2927] transition">Our Story</a>
            <a href="#menu" className="hover:text-[#2C2927] transition">Menu</a>
            <a href="#system" className="hover:text-[#2C2927] transition">System</a>
          </div>
          <Link to="/login" data-testid="nav-signin-btn" className="btn-pill btn-pill-dark text-sm">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="overline mb-6">
          Est. 2026 · A small bakery management studio
        </motion.div>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="font-heading text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl"
        >
          Soft mornings,
          <br />
          <span className="italic font-light text-[#3A3532]">warm pastries,</span>
          <br />
          effortless orders.
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-8 max-w-xl text-[#7E756D] text-lg leading-relaxed"
        >
          A quietly elegant management system for boutique bakeries. Curate your menu,
          take orders with ease, and keep every loaf beautifully organised.
        </motion.p>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-10 flex flex-wrap gap-4">
          <Link to="/login" data-testid="hero-cta-start" className="btn-pill btn-pill-dark">
            Open the studio →
          </Link>
          <a href="#menu" className="btn-pill btn-pill-soft">Peek the menu</a>
        </motion.div>

        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="mt-20 rounded-3xl overflow-hidden soft-shadow relative aspect-[16/7]"
        >
          <img src={heroImg} alt="Soft pastel morning" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/40 via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Story */}
      <section id="story" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-5"
          >
            <div className="overline mb-4">A quiet philosophy</div>
            <h2 className="font-heading text-4xl md:text-5xl leading-tight">
              Less chaos in the kitchen.
              <br />
              <span className="italic text-[#A39B93]">More time with the dough.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
            className="md:col-span-6 md:col-start-7 text-[#7E756D] text-lg leading-relaxed"
          >
            Every pastry deserves care. Our management studio keeps your catalogue,
            your orders, and your memories in one tender place — so you can focus on the rise,
            not the paperwork.
          </motion.p>
        </div>
      </section>

      {/* Menu strip */}
      <section id="menu" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="overline mb-3">Today at bloom</div>
              <h2 className="font-heading text-4xl md:text-5xl">A tender selection</h2>
            </div>
            <Link to="/login" data-testid="menu-cta" className="hidden sm:inline-flex btn-pill btn-pill-outline text-sm">
              Manage yours
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: prod1, name: "Pastel macarons", price: "₹ 180", tag: "Petite" },
              { img: prod2, name: "Almond croissant", price: "₹ 140", tag: "Morning" },
              { img: prod3, name: "Floral layer cake", price: "₹ 1,200", tag: "Occasion" },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="card-bloom overflow-hidden p-0"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] hover:scale-105"
                  />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="overline mb-1">{p.tag}</div>
                    <div className="font-heading text-2xl">{p.name}</div>
                  </div>
                  <div className="font-body text-[#3A3532]">{p.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System feature block */}
      <section id="system" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="rounded-[2rem] bg-[#F4EBE6] p-10 md:p-20 relative overflow-hidden">
            <div className="blob" style={{ width: 400, height: 400, top: -100, right: -80, background: "#E8C4C4", opacity: 0.5 }} />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="overline mb-4">The management system</div>
                <h2 className="font-heading text-4xl md:text-6xl leading-[1] mb-6">
                  Built for
                  <br />
                  <span className="italic">small, beautiful bakeries.</span>
                </h2>
                <p className="text-[#3A3532] text-lg leading-relaxed mb-8 max-w-lg">
                  Add products in seconds. Take orders with a soft, breathable interface.
                  Keep a gentle record of every loaf that left your shelves.
                </p>
                <Link to="/login" data-testid="system-cta" className="btn-pill btn-pill-dark">
                  Start with Google →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { t: "01", h: "Add Products", d: "Name, price, a cute photo." },
                  { t: "02", h: "Take Orders", d: "Auto totals, soft cart." },
                  { t: "03", h: "History", d: "Every order, remembered." },
                  { t: "04", h: "Responsive", d: "Beautiful on every screen." },
                ].map((f, i) => (
                  <motion.div
                    key={f.t}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08 }}
                    className="bg-white/70 backdrop-blur rounded-2xl p-6"
                  >
                    <div className="overline mb-3">{f.t}</div>
                    <div className="font-heading text-2xl mb-1">{f.h}</div>
                    <div className="text-sm text-[#7E756D]">{f.d}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-16 overflow-hidden relative z-10 border-y border-[#EAE4DC]/60">
        <div className="marquee">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-16 px-8 whitespace-nowrap font-heading text-5xl md:text-7xl text-[#A39B93]">
              <span>croissants</span><span className="italic text-[#E8C4C4]">·</span>
              <span>macarons</span><span className="italic text-[#C4D4CD]">·</span>
              <span>sourdough</span><span className="italic text-[#D6CDDF]">·</span>
              <span>éclairs</span><span className="italic text-[#F5D8C6]">·</span>
              <span>tartes</span><span className="italic text-[#E8C4C4]">·</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-sm text-[#A39B93] relative z-10">
        <span className="font-heading italic text-lg">bloom bakery</span> — © 2026 · all warmth reserved
      </footer>
    </div>
  );
}
