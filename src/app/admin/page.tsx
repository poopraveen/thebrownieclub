'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
    ]).then(([o, p]) => {
      if (o.success) setOrders(o.orders);
      if (p.success) setProducts(p.products);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const pending = orders.filter((o: any) => o.status === 'pending').length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-amber-400' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-blue-400' },
    { label: 'Pending Orders', value: pending, icon: Clock, color: 'text-red-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FDF6EC]">Dashboard</h1>
        <p className="text-[#FDF6EC]/50 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-5">
            <s.icon size={22} className={`${s.color} mb-3`} />
            <div className="text-2xl font-bold text-[#FDF6EC]">{loading ? '—' : s.value}</div>
            <div className="text-[#FDF6EC]/50 text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#C8860A]/15">
          <h2 className="font-bold text-[#FDF6EC]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-[#C8860A] text-sm hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#C8860A]/10">
                {['Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[#FDF6EC]/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#FDF6EC]/40">Loading...</td></tr>
              ) : orders.slice(0, 5).map((o: any) => (
                <tr key={o._id} className="border-b border-[#C8860A]/5 hover:bg-[#C8860A]/5 transition-colors">
                  <td className="px-6 py-3 text-[#FDF6EC]">{o.name}</td>
                  <td className="px-6 py-3 text-[#FDF6EC]/60">{o.items?.reduce((s: number, i: any) => s + i.quantity, 0)} pcs</td>
                  <td className="px-6 py-3 text-[#C8860A] font-semibold">₹{o.total}</td>
                  <td className="px-6 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-3 text-[#FDF6EC]/50">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-[#FDF6EC]/40">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/admin/products" className="bg-[#C8860A] hover:bg-[#E8A020] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all">
          Manage Products →
        </Link>
        <Link href="/admin/orders" className="border border-[#C8860A]/40 hover:border-[#C8860A] text-[#FDF6EC] px-6 py-3 rounded-full text-sm transition-all">
          View All Orders →
        </Link>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    baking: 'bg-orange-500/20 text-orange-400',
    delivered: 'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
}
