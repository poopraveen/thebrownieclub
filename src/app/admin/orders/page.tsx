'use client';
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

type Order = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: { product: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'baking' | 'delivered';
  createdAt: string;
};

const STATUSES = ['pending', 'confirmed', 'baking', 'delivered'] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  baking: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [newCount, setNewCount] = useState(0);
  const prevCount = useState(0);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        const incoming = data.orders as Order[];
        if (silent && incoming.length > orders.length) {
          const diff = incoming.length - orders.length;
          setNewCount(diff);
          toast(`🍫 ${diff} new order${diff > 1 ? 's' : ''} received!`, { icon: '🔔' });
        }
        setOrders(incoming);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [orders.length]);

  useEffect(() => {
    load();
    const interval = setInterval(() => load(true), 20000);
    return () => clearInterval(interval);
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json();
    if (data.success) {
      toast.success(`Order marked as ${status}`);
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: status as Order['status'] } : o));
    }
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#FDF6EC]">Orders</h1>
          <p className="text-[#FDF6EC]/50 mt-1">
            {orders.length} total · Auto-refreshes every 20 seconds
            {newCount > 0 && <span className="ml-2 text-amber-400 font-semibold animate-pulse">· {newCount} new!</span>}
          </p>
        </div>
        <button onClick={() => load()} className="flex items-center gap-2 border border-[#C8860A]/30 text-[#FDF6EC]/70 hover:text-[#FDF6EC] px-4 py-2 rounded-full text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border ${
              filter === s
                ? 'bg-[#C8860A] text-white border-[#C8860A]'
                : 'border-[#C8860A]/20 text-[#FDF6EC]/60 hover:text-[#FDF6EC] hover:border-[#C8860A]/40'
            }`}
          >
            {s} {s === 'all' ? `(${orders.length})` : `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#FDF6EC]/40">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#FDF6EC]/40">No orders found</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order._id} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl overflow-hidden">
              {/* Order header */}
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#C8860A]/5 transition-colors"
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-[#FDF6EC]">{order.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    {order.status === 'pending' && (
                      <span className="flex items-center gap-1 text-xs text-red-400 animate-pulse">
                        <Bell size={11} /> New
                      </span>
                    )}
                  </div>
                  <div className="text-[#FDF6EC]/50 text-sm mt-0.5">
                    {order.phone} · {new Date(order.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[#C8860A] font-bold text-lg">₹{order.total}</div>
                  <div className="text-[#FDF6EC]/40 text-xs">{order.items.reduce((s, i) => s + i.quantity, 0)} pieces</div>
                </div>
                {expanded === order._id ? <ChevronUp size={18} className="text-[#FDF6EC]/40 shrink-0" /> : <ChevronDown size={18} className="text-[#FDF6EC]/40 shrink-0" />}
              </div>

              {/* Expanded details */}
              {expanded === order._id && (
                <div className="border-t border-[#C8860A]/10 px-6 py-5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#FDF6EC]/50 mb-1">Email</p>
                      <p className="text-[#FDF6EC]">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-[#FDF6EC]/50 mb-1">Phone</p>
                      <p className="text-[#FDF6EC]">{order.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[#FDF6EC]/50 mb-1">Delivery Address</p>
                      <p className="text-[#FDF6EC]">{order.address}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#FDF6EC]/50 text-sm mb-2">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm bg-[#0D0500] rounded-lg px-4 py-2.5">
                          <span className="text-[#FDF6EC]">{item.product} × {item.quantity}</span>
                          <span className="text-[#C8860A] font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold border-t border-[#C8860A]/20 pt-2">
                        <span className="text-[#FDF6EC]">Total</span>
                        <span className="text-[#C8860A] text-base">₹{order.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status update */}
                  <div>
                    <p className="text-[#FDF6EC]/50 text-sm mb-2">Update Status</p>
                    <div className="flex gap-2 flex-wrap">
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order._id, s)}
                          disabled={order.status === s}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
                            order.status === s
                              ? `${STATUS_COLORS[s]} cursor-default`
                              : 'border-[#C8860A]/20 text-[#FDF6EC]/60 hover:border-[#C8860A]/60 hover:text-[#FDF6EC]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
