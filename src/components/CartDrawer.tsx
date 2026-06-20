'use client';
import { useCart } from '@/contexts/CartContext';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, remove, update, total, count, open, setOpen } = useCart();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1A0A00] border-l border-[#C8860A]/20 z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#C8860A]/20">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#C8860A]" />
            <h2 className="text-lg font-bold text-[#FDF6EC]">Your Cart</h2>
            {count > 0 && (
              <span className="bg-[#C8860A] text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="text-[#FDF6EC]/60 hover:text-[#FDF6EC] transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl">🍫</span>
              <p className="text-[#FDF6EC]/50">Your cart is empty</p>
              <button
                onClick={() => setOpen(false)}
                className="text-[#C8860A] text-sm hover:underline"
              >
                Browse our menu →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-[#0D0500] rounded-xl p-4 border border-[#C8860A]/10">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#FDF6EC] font-medium text-sm truncate">{item.name}</p>
                  <p className="text-[#C8860A] font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => update(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-[#C8860A]/20 hover:bg-[#C8860A]/40 flex items-center justify-center transition-colors"
                  >
                    <Minus size={12} className="text-[#C8860A]" />
                  </button>
                  <span className="text-[#FDF6EC] font-bold w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => update(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-[#C8860A] hover:bg-[#E8A020] flex items-center justify-center transition-colors"
                  >
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
                <div className="text-right ml-1">
                  <p className="text-[#FDF6EC] text-sm font-semibold">₹{item.price * item.quantity}</p>
                  <button onClick={() => remove(item.id)} className="text-red-400/60 hover:text-red-400 mt-1 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#C8860A]/20 space-y-4">
            {count < 6 && (
              <p className="text-amber-400 text-xs text-center">
                Add {6 - count} more piece{6 - count > 1 ? 's' : ''} to meet the minimum order of 6
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[#FDF6EC]/70">Total ({count} pieces)</span>
              <span className="text-2xl font-bold text-[#C8860A]">₹{total}</span>
            </div>
            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="block w-full bg-[#C8860A] hover:bg-[#E8A020] text-white py-3.5 rounded-full font-semibold text-center transition-all hover:scale-105"
            >
              Proceed to Order →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
