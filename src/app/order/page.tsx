'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

const products = [
  { name: 'Classic Dark Chocolate', price: 80, emoji: '🍫' },
  { name: 'Salted Caramel Swirl', price: 100, emoji: '🍮' },
  { name: 'Cream Cheese Marble', price: 110, emoji: '🌀' },
  { name: 'Nutella Stuffed', price: 120, emoji: '🫙' },
  { name: 'Walnut Crunch', price: 90, emoji: '🌰' },
  { name: 'Cookies & Cream', price: 105, emoji: '🍪' },
  { name: 'Biscoff Stuffed', price: 125, emoji: '🧡' },
  { name: 'Peanut Butter Core', price: 115, emoji: '🥜' },
  { name: 'Espresso Chocolate', price: 95, emoji: '☕' },
];

type CartItem = { product: string; quantity: number; price: number };

export default function OrderPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const addToCart = (name: string) => setCart((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
  const removeFromCart = (name: string) => setCart((c) => {
    const next = { ...c };
    if (next[name] > 1) next[name]--;
    else delete next[name];
    return next;
  });

  const items: CartItem[] = Object.entries(cart).map(([product, quantity]) => ({
    product,
    quantity,
    price: products.find((p) => p.name === product)?.price || 0,
  }));

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalQty < 6) { toast.error('Minimum order is 6 pieces'); return; }
    if (!form.name || !form.email || !form.phone || !form.address) { toast.error('Please fill all fields'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, total }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order placed! We\'ll confirm via WhatsApp shortly 🍫');
        setCart({});
        setForm({ name: '', email: '', phone: '', address: '' });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0500] pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Fresh & Delivered</p>
          <h1 className="text-5xl font-bold text-[#FDF6EC] mb-3">
            Place Your <span className="gradient-text">Order</span>
          </h1>
          <p className="text-[#FDF6EC]/50">Minimum 6 pieces. Delivered fresh across Bangalore.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#FDF6EC] mb-5">Choose Your Brownies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.name} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-xl p-4 flex items-center justify-between card-glow">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="text-[#FDF6EC] font-medium text-sm">{p.name}</div>
                      <div className="text-[#C8860A] font-bold">₹{p.price}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart[p.name] ? (
                      <>
                        <button onClick={() => removeFromCart(p.name)} className="w-8 h-8 rounded-full bg-[#C8860A]/20 hover:bg-[#C8860A] text-[#C8860A] hover:text-white font-bold transition-all flex items-center justify-center">−</button>
                        <span className="text-[#FDF6EC] font-bold w-5 text-center">{cart[p.name]}</span>
                        <button onClick={() => addToCart(p.name)} className="w-8 h-8 rounded-full bg-[#C8860A] hover:bg-[#E8A020] text-white font-bold transition-all flex items-center justify-center">+</button>
                      </>
                    ) : (
                      <button onClick={() => addToCart(p.name)} className="w-8 h-8 rounded-full bg-[#C8860A]/20 hover:bg-[#C8860A] text-[#C8860A] hover:text-white font-bold transition-all flex items-center justify-center">+</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary + Form */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-[#1A0A00] border border-[#C8860A]/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#FDF6EC] mb-4">Your Order</h2>
              {items.length === 0 ? (
                <p className="text-[#FDF6EC]/40 text-sm text-center py-4">Add brownies to get started</p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {items.map((i) => (
                    <li key={i.product} className="flex justify-between text-sm text-[#FDF6EC]/80">
                      <span>{i.product} × {i.quantity}</span>
                      <span className="text-[#C8860A]">₹{i.price * i.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-[#C8860A]/20 pt-3 flex justify-between font-bold">
                <span className="text-[#FDF6EC]">Total ({totalQty} pcs)</span>
                <span className="text-[#C8860A] text-xl">₹{total}</span>
              </div>
              {totalQty > 0 && totalQty < 6 && (
                <p className="text-amber-400 text-xs mt-2">Add {6 - totalQty} more pieces (min 6)</p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-[#1A0A00] border border-[#C8860A]/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#FDF6EC] mb-2">Delivery Details</h2>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'WhatsApp Number', type: 'tel', placeholder: '+91 98765 43210' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[#FDF6EC]/60 text-xs mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-lg px-4 py-2.5 text-[#FDF6EC] text-sm outline-none transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[#FDF6EC]/60 text-xs mb-1">Delivery Address</label>
                <textarea
                  placeholder="Full address with landmark"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  className="w-full bg-[#0D0500] border border-[#C8860A]/20 focus:border-[#C8860A] rounded-lg px-4 py-2.5 text-[#FDF6EC] text-sm outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || totalQty < 6}
                className="w-full bg-[#C8860A] hover:bg-[#E8A020] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-full font-semibold transition-all hover:scale-105"
              >
                {loading ? 'Placing Order...' : `Place Order — ₹${total}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
