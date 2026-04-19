import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { API } from "@/App";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export default function Orders() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/products`);
        setProducts(res.data);
        if (res.data.length) setSelectedId(res.data[0].id);
      } catch {
        toast.error("Couldn't load products");
      }
    })();
  }, []);

  const total = useMemo(() => cart.reduce((s, i) => s + i.subtotal, 0), [cart]);

  const addToCart = () => {
    const p = products.find((x) => x.id === selectedId);
    if (!p) return toast.error("Pick a product");
    if (qty < 1) return toast.error("Quantity must be ≥ 1");
    setCart((prev) => {
      const existing = prev.find((c) => c.product_id === p.id);
      if (existing) {
        return prev.map((c) =>
          c.product_id === p.id
            ? { ...c, quantity: c.quantity + qty, subtotal: (c.quantity + qty) * c.price }
            : c
        );
      }
      return [
        ...prev,
        { product_id: p.id, name: p.name, price: p.price, quantity: qty, subtotal: p.price * qty },
      ];
    });
    toast.success(`${p.name} × ${qty} added`);
    setQty(1);
  };

  const updateQty = (pid, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.product_id === pid
            ? { ...c, quantity: Math.max(0, c.quantity + delta), subtotal: Math.max(0, c.quantity + delta) * c.price }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeItem = (pid) => setCart((p) => p.filter((c) => c.product_id !== pid));

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty");
    setPlacing(true);
    try {
      await axios.post(`${API}/orders`, { items: cart });
      toast.success("Order placed — thank you!");
      setCart([]);
    } catch {
      toast.error("Couldn't place the order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="overline mb-4">A new order</div>
        <h1 className="font-heading text-5xl md:text-7xl leading-[1] mb-4">
          Compose an <span className="italic">order</span>
        </h1>
        <p className="text-[#7E756D] max-w-xl">Pick, add, breathe, place.</p>
      </motion.div>

      {products.length === 0 ? (
        <div className="card-bloom p-16 text-center mt-12" data-testid="no-products-cart">
          <div className="font-heading text-3xl italic text-[#A39B93] mb-3">nothing to sell yet</div>
          <Link to="/products" className="btn-pill btn-pill-dark mt-4 inline-flex">Add your first product →</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10 mt-14">
          {/* Compose */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="card-bloom p-8">
              <div className="overline mb-4">Add to cart</div>
              <div className="grid sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
                <div>
                  <label className="overline block mb-2">Product</label>
                  <select
                    data-testid="product-select"
                    className="input-soft"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="overline block mb-2">Quantity</label>
                  <input
                    data-testid="qty-input"
                    type="number"
                    min="1"
                    className="input-soft"
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value || "1"))}
                  />
                </div>
                <button
                  onClick={addToCart}
                  className="btn-pill btn-pill-dark"
                  data-testid="add-to-cart-btn"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Product tiles */}
            <div className="grid sm:grid-cols-3 gap-4">
              {products.slice(0, 6).map((p, i) => (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.05 }}
                  onClick={() => { setSelectedId(p.id); setQty(1); addToCart(); }}
                  className="card-bloom p-0 overflow-hidden text-left"
                  data-testid={`quick-add-${p.id}`}
                >
                  {p.image_url && (
                    <div className="aspect-[4/3] overflow-hidden bg-[#F4EBE6]">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="font-heading text-lg">{p.name}</div>
                    <div className="text-sm text-[#7E756D]">₹ {p.price.toFixed(2)}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Cart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="card-bloom p-8 lg:sticky lg:top-32" data-testid="cart-panel">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="overline mb-1">The cart</div>
                  <div className="font-heading text-3xl">Your selection</div>
                </div>
                <ShoppingBag className="text-[#A39B93]" size={22} strokeWidth={1.3} />
              </div>

              {cart.length === 0 ? (
                <div className="py-14 text-center" data-testid="empty-cart">
                  <div className="font-heading italic text-2xl text-[#A39B93]">softly empty</div>
                  <div className="text-sm text-[#7E756D] mt-2">Pick something from the left.</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {cart.map((c) => (
                      <motion.div
                        key={c.product_id}
                        layout
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5]"
                        data-testid={`cart-item-${c.product_id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-heading text-lg truncate">{c.name}</div>
                          <div className="text-xs text-[#7E756D]">₹ {c.price.toFixed(2)} × {c.quantity}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(c.product_id, -1)} className="w-7 h-7 rounded-full bg-white border border-[#EAE4DC] hover:bg-[#F4EBE6] transition flex items-center justify-center" data-testid={`qty-dec-${c.product_id}`}>
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm">{c.quantity}</span>
                          <button onClick={() => updateQty(c.product_id, 1)} className="w-7 h-7 rounded-full bg-white border border-[#EAE4DC] hover:bg-[#F4EBE6] transition flex items-center justify-center" data-testid={`qty-inc-${c.product_id}`}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-sm w-20 text-right font-medium" data-testid={`subtotal-${c.product_id}`}>
                          ₹ {c.subtotal.toFixed(2)}
                        </div>
                        <button onClick={() => removeItem(c.product_id)} className="text-[#A39B93] hover:text-[#D98080] transition" data-testid={`remove-${c.product_id}`}>
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="pt-5 mt-5 border-t border-[#EAE4DC] flex items-baseline justify-between">
                    <div className="overline">Total</div>
                    <div className="font-heading text-4xl italic" data-testid="cart-total">
                      ₹ {total.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="btn-pill btn-pill-dark w-full mt-4 disabled:opacity-60"
                    data-testid="place-order-btn"
                  >
                    {placing ? "Placing…" : "Place order →"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
