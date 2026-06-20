import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 bg-[#0D0500]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8860A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#8B4513]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8860A]/5 rounded-full blur-3xl" />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,134,10,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,134,10,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20 md:pt-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#C8860A]/10 border border-[#C8860A]/30 rounded-full px-5 py-2 mb-8">
          <Star size={14} className="text-[#C8860A] fill-[#C8860A]" />
          <span className="text-[#C8860A] text-sm font-medium tracking-wide">Bangalore&apos;s Finest Artisan Brownies</span>
          <Star size={14} className="text-[#C8860A] fill-[#C8860A]" />
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-6">
          <span className="block text-[#FDF6EC]">Life is Better</span>
          <span className="block shimmer mt-2">With Brownies</span>
        </h1>

        <p className="text-[#FDF6EC]/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Handcrafted with Belgian chocolate, baked fresh every morning in Bangalore.
          Each bite is a warm hug of pure indulgence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/order"
            className="group bg-[#C8860A] hover:bg-[#E8A020] text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#C8860A]/30 flex items-center gap-3"
          >
            Order Fresh Brownies
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/menu"
            className="border border-[#C8860A]/40 hover:border-[#C8860A] text-[#FDF6EC] px-8 py-4 rounded-full text-lg font-medium transition-all hover:bg-[#C8860A]/10"
          >
            Explore Menu
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-20 pt-10 border-t border-[#C8860A]/15">
          {[
            { num: '500+', label: 'Happy Customers' },
            { num: '15+', label: 'Flavours' },
            { num: '100%', label: 'Fresh Daily' },
            { num: '4.9★', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">{stat.num}</div>
              <div className="text-[#FDF6EC]/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0500] to-transparent" />
    </section>
  );
}
