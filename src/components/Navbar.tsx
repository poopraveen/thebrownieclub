'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/order', label: 'Order Now' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0D0500]/95 backdrop-blur-md shadow-lg shadow-amber-900/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍫</span>
          <span className="text-xl font-bold gradient-text tracking-wide">The Brownie Club</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[#FDF6EC]/80 hover:text-[#C8860A] transition-colors text-sm tracking-wide font-medium"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="bg-[#C8860A] hover:bg-[#E8A020] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2"
          >
            <ShoppingBag size={16} /> Order
          </Link>
        </div>

        <button className="md:hidden text-[#FDF6EC]" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#1A0A00]/98 backdrop-blur-md border-t border-[#C8860A]/20 px-6 py-6 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-[#FDF6EC]/80 hover:text-[#C8860A] transition-colors text-lg font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
