import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';

export function FeaturedProducts() {
  return (
    <section className="py-24 px-6 bg-[#0D0500]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Our Signature Collection</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FDF6EC] mb-4">
            Made to <span className="gradient-text">Obsess Over</span>
          </h2>
          <p className="text-[#FDF6EC]/50 max-w-lg mx-auto">
            Each flavour is obsessively developed and perfected before it earns a spot on our menu.
          </p>
        </div>

        <ProductGrid />

        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 border border-[#C8860A]/40 hover:border-[#C8860A] text-[#FDF6EC] hover:text-[#C8860A] px-8 py-4 rounded-full transition-all"
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
