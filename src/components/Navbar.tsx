'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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
  const { count, setOpen: openCart } = useCart();

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
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="The Brownie Club" width={48} height={48} className="rounded-full" />
          <span className="text-lg font-bold gradient-text tracking-wide hidden sm:block">The Brownie Club</span>
        </Link>

        {/* Desktop links */}
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
        </div>

        {/* Cart + Mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openCart(true)}
            className="relative w-10 h-10 rounded-full bg-[#C8860A]/20 hover:bg-[#C8860A]/40 flex items-center justify-center transition-colors"
          >
            <ShoppingBag size={18} className="text-[#C8860A]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C8860A] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          <button className="md:hidden text-[#FDF6EC]" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
