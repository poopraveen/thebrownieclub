import { ProductGrid } from '@/components/ProductGrid';

export const revalidate = 0;

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#0D0500] pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Fresh Daily</p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#FDF6EC] mb-4">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-[#FDF6EC]/50 max-w-lg mx-auto">
            All brownies baked fresh daily. Minimum order 6 pieces for delivery.
            Add to cart and checkout to place your order.
          </p>
        </div>
        <ProductGrid showAll />
      </div>
    </div>
  );
}
