'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Plus, Minus } from 'lucide-react';
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
};

export function ProductGrid({ showAll = false }: { showAll?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, add, update } = useCart();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProducts(showAll ? d.products : d.products.filter((p: Product) => p.featured));
        }
      })
      .finally(() => setLoading(false));
  }, [showAll]);

  const getQty = (id: string) => items.find((i) => i.id === id)?.quantity || 0;

  const handleAdd = (p: Product) => {
    add({ id: p._id, name: p.name, price: p.price, emoji: p.emoji });
    toast.success(`${p.emoji} Added to cart!`, { duration: 1500 });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#1A0A00] border border-[#C8860A]/10 rounded-2xl p-6 animate-pulse">
            <div className="w-12 h-12 bg-[#C8860A]/10 rounded-full mb-4" />
            <div className="h-4 bg-[#C8860A]/10 rounded mb-2 w-3/4" />
            <div className="h-3 bg-[#C8860A]/10 rounded w-full mb-4" />
            <div className="h-3 bg-[#C8860A]/10 rounded w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  // Group by category if showAll
  if (showAll) {
    const categories = [...new Set(products.map((p) => p.category))];
    return (
      <div className="space-y-14">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="text-2xl font-bold text-[#C8860A] mb-6 pb-3 border-b border-[#C8860A]/20">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.filter((p) => p.category === cat).map((p) => (
                <ProductCard key={p._id} product={p} qty={getQty(p._id)} onAdd={() => handleAdd(p)} onUpdate={(q) => update(p._id, q)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} qty={getQty(p._id)} onAdd={() => handleAdd(p)} onUpdate={(q) => update(p._id, q)} />
      ))}
    </div>
  );
}

function ProductCard({
  product: p,
  qty,
  onAdd,
  onUpdate,
}: {
  product: Product;
  qty: number;
  onAdd: () => void;
  onUpdate: (q: number) => void;
}) {
  return (
    <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-6 card-glow group relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8860A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className="text-5xl float">{p.emoji}</span>
          {p.tag && (
            <span className={`${p.tagColor || 'bg-amber-700'} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              {p.tag}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-[#FDF6EC] mb-2">{p.name}</h3>
        <p className="text-[#FDF6EC]/55 text-sm leading-relaxed mb-5">{p.description}</p>
      </div>
      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div>
          <span className="text-2xl font-bold text-[#C8860A]">₹{p.price}</span>
          <span className="text-[#FDF6EC]/40 text-xs ml-1">/ piece</span>
        </div>
        {qty === 0 ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-[#C8860A] hover:bg-[#E8A020] text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
          >
            <ShoppingBag size={14} /> Add
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#C8860A]/10 rounded-full px-2 py-1">
            <button onClick={() => onUpdate(qty - 1)} className="w-7 h-7 rounded-full bg-[#C8860A]/30 hover:bg-[#C8860A]/60 flex items-center justify-center transition-colors">
              <Minus size={12} className="text-[#C8860A]" />
            </button>
            <span className="text-[#FDF6EC] font-bold w-5 text-center">{qty}</span>
            <button onClick={onAdd} className="w-7 h-7 rounded-full bg-[#C8860A] hover:bg-[#E8A020] flex items-center justify-center transition-colors">
              <Plus size={12} className="text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
