import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/App";
import { Pencil, Trash2, Plus, X, Check } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image_url: "" });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", image_url: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch {
      toast.error("Couldn't load products");
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/products`, {
        name: form.name,
        price: parseFloat(form.price),
        image_url: form.image_url || null,
      });
      toast.success(`${form.name} added to the catalogue`);
      setForm({ name: "", price: "", image_url: "" });
      load();
    } catch {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditing(p.id);
    setEditForm({ name: p.name, price: String(p.price), image_url: p.image_url || "" });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API}/products/${id}`, {
        name: editForm.name,
        price: parseFloat(editForm.price),
        image_url: editForm.image_url || null,
      });
      toast.success("Product updated");
      setEditing(null);
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Remove this product from the catalogue?")) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success("Product removed");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="overline mb-4">The catalogue</div>
        <h1 className="font-heading text-5xl md:text-7xl leading-[1] mb-4">
          Your <span className="italic">products</span>
        </h1>
        <p className="text-[#7E756D] max-w-xl">Add a pastry, tweak a price, remove with care.</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10 mt-14">
        {/* Add form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="card-bloom p-8 lg:sticky lg:top-32">
            <div className="overline mb-3">Add a new creation</div>
            <h2 className="font-heading text-3xl mb-6">A fresh addition</h2>
            <form onSubmit={handleAdd} className="space-y-4" data-testid="add-product-form">
              <div>
                <label className="overline block mb-2">Name</label>
                <input
                  data-testid="product-name-input"
                  className="input-soft"
                  placeholder="Almond croissant"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="overline block mb-2">Price (₹)</label>
                <input
                  data-testid="product-price-input"
                  className="input-soft"
                  type="number"
                  step="0.01"
                  placeholder="140"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="overline block mb-2">Image URL (optional)</label>
                <input
                  data-testid="product-image-input"
                  className="input-soft"
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </div>
              <button
                data-testid="add-product-btn"
                type="submit"
                disabled={loading}
                className="btn-pill btn-pill-dark w-full mt-4 disabled:opacity-60"
              >
                <Plus size={16} /> {loading ? "Adding…" : "Add product"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="lg:col-span-7">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-bloom p-16 text-center"
              data-testid="empty-products"
            >
              <div className="font-heading text-3xl italic text-[#A39B93] mb-3">quiet shelves</div>
              <div className="text-[#7E756D]">Add your first pastry to begin.</div>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5" data-testid="product-grid">
              <AnimatePresence>
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="card-bloom p-0 overflow-hidden"
                    data-testid={`product-card-${p.id}`}
                  >
                    {p.image_url && (
                      <div className="aspect-[4/3] overflow-hidden bg-[#F4EBE6]">
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      {editing === p.id ? (
                        <div className="space-y-3">
                          <input
                            className="input-soft"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            data-testid="edit-name-input"
                          />
                          <input
                            className="input-soft"
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            data-testid="edit-price-input"
                          />
                          <input
                            className="input-soft"
                            placeholder="Image URL"
                            value={editForm.image_url}
                            onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                            data-testid="edit-image-input"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(p.id)}
                              className="btn-pill btn-pill-dark flex-1 text-sm py-2"
                              data-testid="save-edit-btn"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="btn-pill btn-pill-soft text-sm py-2"
                              data-testid="cancel-edit-btn"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-heading text-2xl" data-testid="product-name">{p.name}</div>
                              <div className="font-body text-[#7E756D] mt-1" data-testid="product-price">₹ {p.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => startEdit(p)}
                              className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-full bg-[#F4EBE6] hover:bg-[#E8C4C4] text-sm transition"
                              data-testid={`edit-btn-${p.id}`}
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            <button
                              onClick={() => del(p.id)}
                              className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#D98080] hover:text-white text-sm transition border border-[#EAE4DC]"
                              data-testid={`delete-btn-${p.id}`}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
