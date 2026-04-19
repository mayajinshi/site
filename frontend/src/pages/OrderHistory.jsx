import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { API } from "@/App";
import { ScrollText } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/orders`);
        setOrders(res.data);
      } catch {
        toast.error("Couldn't load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="overline mb-4">A gentle record</div>
        <h1 className="font-heading text-5xl md:text-7xl leading-[1] mb-4">
          Order <span className="italic">history</span>
        </h1>
        <p className="text-[#7E756D] max-w-xl">Every order, remembered with care.</p>
      </motion.div>

      {loading ? (
        <div className="mt-20 text-center text-[#A39B93] font-heading italic text-2xl">loading softly…</div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-bloom p-16 text-center mt-14"
          data-testid="empty-history"
        >
          <ScrollText className="mx-auto mb-4 text-[#A39B93]" size={36} strokeWidth={1} />
          <div className="font-heading text-3xl italic text-[#A39B93] mb-3">no orders yet</div>
          <Link to="/orders" className="btn-pill btn-pill-dark mt-4 inline-flex">Place your first →</Link>
        </motion.div>
      ) : (
        <div className="mt-14 space-y-5" data-testid="orders-list">
          {orders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="card-bloom p-8"
              data-testid={`order-${o.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="overline mb-2">Order</div>
                  <div className="font-heading text-2xl">
                    #{o.id.slice(0, 8)}
                  </div>
                  <div className="text-xs text-[#A39B93] mt-1">
                    {new Date(o.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="overline mb-2">Total</div>
                  <div className="font-heading text-3xl italic">₹ {o.total.toFixed(2)}</div>
                </div>
              </div>
              <div className="border-t border-[#EAE4DC] pt-5 space-y-2">
                {o.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="text-[#3A3532]">
                      <span className="font-medium">{it.name}</span>
                      <span className="text-[#A39B93]"> × {it.quantity}</span>
                    </div>
                    <div className="text-[#3A3532]">₹ {it.subtotal.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
