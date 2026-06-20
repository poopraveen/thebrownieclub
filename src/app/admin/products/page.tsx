'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
  tag: string;
  tagColor: string;
  available: boolean;
  featured: boolean;
  sortOrder: number;
};

const EMPTY: Omit<Product, '_id'> = {
  name: '', description: '', price: 0, emoji: '🍫',
  category: 'Signature', tag: '', tagColor: 'bg-amber-700',
  available: true, featured: false, sortOrder: 0,
};

const CATEGORIES = ['Signature', 'Premium', 'Seasonal', 'Gift Box'];
const EMOJIS = ['🍫', '🍮', '🌀', '🫙', '🌰', '🍪', '🧡', '🥜', '☕', '❤️', '🥭', '🎁'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, '_id'>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, emoji: p.emoji, category: p.category, tag: p.tag, tagColor: p.tagColor, available: p.available, featured: p.featured, sortOrder: p.sortOrder }); setModal(true); };

  const save = async () => {
    if (!form.name || !form.description || !form.price) { toast.error('Fill in required fields'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/products/${editing._id}` : '/api/products';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        toast.success(editing ? 'Product updated!' : 'Product added!');
        setModal(false);
        load();
      } else { toast.error('Failed to save'); }
    } catch { toast.error('Error saving product'); }
    setSaving(false);
  };

  const toggle = async (p: Product, field: 'available' | 'featured') => {
    const res = await fetch(`/api/products/${p._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: !p[field] }) });
    const data = await res.json();
    if (data.success) { toast.success(`${field === 'available' ? (p.available ? 'Hidden' : 'Shown') : (p.featured ? 'Unfeatured' : 'Featured')}!`); load(); }
  };

  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${p._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { toast.success('Deleted'); load(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#FDF6EC]">Products</h1>
          <p className="text-[#FDF6EC]/50 mt-1">{products.length} products · Manage what customers see</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#C8860A] hover:bg-[#E8A020] text-white px-5 py-2.5 rounded-full font-semibold transition-all hover:scale-105"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="text-[#FDF6EC]/40 text-center py-16">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className={`bg-[#1A0A00] border rounded-2xl p-5 transition-all ${p.available ? 'border-[#C8860A]/15' : 'border-[#FDF6EC]/5 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggle(p, 'featured')} title={p.featured ? 'Unfeature' : 'Feature on home'} className="w-8 h-8 rounded-lg hover:bg-[#C8860A]/20 flex items-center justify-center transition-colors">
                    {p.featured ? <Star size={15} className="text-[#C8860A] fill-[#C8860A]" /> : <StarOff size={15} className="text-[#FDF6EC]/30" />}
                  </button>
                  <button onClick={() => toggle(p, 'available')} title={p.available ? 'Hide from menu' : 'Show on menu'} className="w-8 h-8 rounded-lg hover:bg-[#C8860A]/20 flex items-center justify-center transition-colors">
                    {p.available ? <Eye size={15} className="text-green-400" /> : <EyeOff size={15} className="text-[#FDF6EC]/30" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                    <Pencil size={15} className="text-blue-400" />
                  </button>
                  <button onClick={() => del(p)} className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors">
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-[#FDF6EC] mb-1">{p.name}</h3>
              <p className="text-[#FDF6EC]/50 text-xs leading-relaxed mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#C8860A] font-bold">₹{p.price}</span>
                <span className="text-[#FDF6EC]/30 text-xs">·</span>
                <span className="text-[#FDF6EC]/40 text-xs">{p.category}</span>
                {p.tag && <span className={`${p.tagColor} text-white text-xs px-2 py-0.5 rounded-full`}>{p.tag}</span>}
                {!p.available && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full">Hidden</span>}
                {p.featured && <span className="bg-[#C8860A]/20 text-[#C8860A] text-xs px-2 py-0.5 rounded-full">Featured</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A0A00] border border-[#C8860A]/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8860A]/15">
              <h2 className="text-lg font-bold text-[#FDF6EC]">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModal(false)}><X size={20} className="text-[#FDF6EC]/60" /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Emoji picker */}
              <div>
                <label className="block text-[#FDF6EC]/60 text-sm mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button key={e} onClick={() => setForm({ ...form, emoji: e })} className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${form.emoji === e ? 'bg-[#C8860A] scale-110' : 'bg-[#0D0500] hover:bg-[#C8860A]/20'}`}>{e}</button>
                  ))}
                </div>
              </div>

              {[
                { key: 'name', label: 'Product Name *', type: 'text', placeholder: 'e.g. Dark Chocolate Brownie' },
                { key: 'price', label: 'Price (₹) *', type: 'number', placeholder: '80' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[#FDF6EC]/60 text-sm mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-2.5 text-[#FDF6EC] text-sm outline-none transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[#FDF6EC]/60 text-sm mb-1.5">Description *</label>
                <textarea
                  placeholder="Describe this brownie..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-2.5 text-[#FDF6EC] text-sm outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#FDF6EC]/60 text-sm mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-2.5 text-[#FDF6EC] text-sm outline-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#FDF6EC]/60 text-sm mb-1.5">Badge Label</label>
                  <input type="text" placeholder="e.g. New, Popular" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-xl px-4 py-2.5 text-[#FDF6EC] text-sm outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-[#C8860A] w-4 h-4" />
                  <span className="text-[#FDF6EC]/70 text-sm">Visible on menu</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#C8860A] w-4 h-4" />
                  <span className="text-[#FDF6EC]/70 text-sm">Featured on home</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#C8860A]/15 flex gap-3">
              <button onClick={() => setModal(false)} className="flex-1 border border-[#C8860A]/30 text-[#FDF6EC]/70 py-2.5 rounded-full text-sm font-medium">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#C8860A] hover:bg-[#E8A020] disabled:opacity-50 text-white py-2.5 rounded-full text-sm font-semibold transition-all">
                <Save size={15} /> {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
