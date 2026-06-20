import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="py-24 px-6 bg-[#080200]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#3B1F0E] to-[#1A0A00] border border-[#C8860A]/30 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 30% 70%, #C8860A 0%, transparent 50%), radial-gradient(circle at 70% 30%, #8B4513 0%, transparent 50%)'
          }} />
          <div className="relative z-10">
            <div className="text-6xl mb-6">🍫</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#FDF6EC] mb-4">
              Ready for Your <span className="gradient-text">Brownie Fix?</span>
            </h2>
            <p className="text-[#FDF6EC]/60 text-lg mb-8 max-w-lg mx-auto">
              Order now and get fresh brownies delivered to your door across Bangalore.
              Minimum order: 6 pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/order"
                className="bg-[#C8860A] hover:bg-[#E8A020] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#C8860A]/30"
              >
                Order Now →
              </Link>
              <Link
                href="/contact"
                className="border border-[#C8860A]/40 hover:border-[#C8860A] text-[#FDF6EC] px-10 py-4 rounded-full text-lg font-medium transition-all hover:bg-[#C8860A]/10"
              >
                WhatsApp Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
