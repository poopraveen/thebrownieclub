import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#080200] border-t border-[#C8860A]/20 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🍫</span>
            <span className="text-2xl font-bold gradient-text">The Brownie Club</span>
          </div>
          <p className="text-[#FDF6EC]/60 leading-relaxed max-w-sm">
            Handcrafted with love in Bangalore. Every brownie is baked fresh using the finest Belgian chocolate and local ingredients.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center hover:bg-[#C8860A] transition-colors text-[#C8860A] hover:text-white text-sm font-bold">
              IG
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#C8860A]/20 flex items-center justify-center hover:bg-[#C8860A] transition-colors text-[#C8860A] hover:text-white text-sm font-bold">
              FB
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[#C8860A] font-semibold mb-4 tracking-wide">Quick Links</h4>
          <ul className="space-y-2">
            {['Home', 'Menu', 'Order Now', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link href={`/${item === 'Home' ? '' : item.toLowerCase().replace(' ', '')}`} className="text-[#FDF6EC]/60 hover:text-[#C8860A] transition-colors text-sm">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#C8860A] font-semibold mb-4 tracking-wide">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-[#FDF6EC]/60">
              <MapPin size={16} className="text-[#C8860A] mt-0.5 shrink-0" />
              Indiranagar, Bangalore, Karnataka 560038
            </li>
            <li className="flex items-center gap-3 text-sm text-[#FDF6EC]/60">
              <Phone size={16} className="text-[#C8860A] shrink-0" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3 text-sm text-[#FDF6EC]/60">
              <Mail size={16} className="text-[#C8860A] shrink-0" />
              hello@thebrownieclub.in
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#C8860A]/10 text-center text-[#FDF6EC]/40 text-sm">
        © {new Date().getFullYear()} The Brownie Club. Made with 🍫 in Bangalore.
      </div>
    </footer>
  );
}
