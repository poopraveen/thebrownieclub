'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Bell, Menu, X, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setUnread(data.unread);
        setNotifications(data.notifications);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    setUnread(0);
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#080200] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D0500] border-r border-[#C8860A]/15 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-6 py-5 border-b border-[#C8860A]/15 flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-full" />
          <div>
            <div className="text-sm font-bold text-[#FDF6EC]">The Brownie Club</div>
            <div className="text-xs text-[#C8860A]">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#C8860A] text-white'
                    : 'text-[#FDF6EC]/60 hover:text-[#FDF6EC] hover:bg-[#C8860A]/10'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#C8860A]/15">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-[#FDF6EC]/50 hover:text-[#FDF6EC] transition-colors">
            <LogOut size={16} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0D0500]/95 backdrop-blur border-b border-[#C8860A]/15 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden text-[#FDF6EC]" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="text-[#FDF6EC]/60 text-sm hidden lg:block">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="relative ml-auto">
            <button
              onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unread > 0) markAllRead(); }}
              className="relative w-10 h-10 rounded-full bg-[#C8860A]/15 hover:bg-[#C8860A]/30 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-[#C8860A]" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#1A0A00] border border-[#C8860A]/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#C8860A]/15">
                  <span className="font-semibold text-[#FDF6EC] text-sm">Notifications</span>
                  <button onClick={() => setNotifOpen(false)}><X size={16} className="text-[#FDF6EC]/50" /></button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-[#FDF6EC]/40 text-sm py-6">No notifications yet</p>
                  ) : notifications.map((n) => (
                    <div key={n._id} className={`px-4 py-3 border-b border-[#C8860A]/10 ${!n.read ? 'bg-[#C8860A]/5' : ''}`}>
                      <p className="text-sm text-[#FDF6EC]/80">{n.message}</p>
                      <p className="text-xs text-[#FDF6EC]/40 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-[#C8860A]/15">
                    <Link href="/admin/orders" onClick={() => setNotifOpen(false)} className="text-xs text-[#C8860A] hover:underline">View all orders →</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
