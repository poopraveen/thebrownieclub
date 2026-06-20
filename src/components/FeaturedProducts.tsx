import Link from 'next/link';

const products = [
  {
    name: 'Classic Dark Chocolate',
    description: 'Rich, dense, fudgy brownie made with 70% Belgian dark chocolate. The OG that started it all.',
    price: 80,
    emoji: '🍫',
    tag: 'Bestseller',
    tagColor: 'bg-[#C8860A]',
  },
  {
    name: 'Salted Caramel Swirl',
    description: 'Gooey caramel ribbons through velvety chocolate batter, finished with Himalayan sea salt.',
    price: 100,
    emoji: '🍮',
    tag: 'Fan Favourite',
    tagColor: 'bg-[#8B4513]',
  },
  {
    name: 'Cream Cheese Marble',
    description: 'Silky cream cheese swirled into chocolate perfection. Sweet, tangy, and absolutely dreamy.',
    price: 110,
    emoji: '🌀',
    tag: 'New',
    tagColor: 'bg-[#2D5016]',
  },
  {
    name: 'Nutella Stuffed',
    description: 'A hidden molten Nutella core inside our signature dark chocolate brownie. Pure joy.',
    price: 120,
    emoji: '🫙',
    tag: 'Indulgent',
    tagColor: 'bg-[#6B1F1F]',
  },
  {
    name: 'Walnut Crunch',
    description: 'Toasted California walnuts folded into our classic batter for the perfect texture contrast.',
    price: 90,
    emoji: '🌰',
    tag: 'Classic',
    tagColor: 'bg-[#4A3728]',
  },
  {
    name: 'Cookies & Cream',
    description: 'Oreo crumble on top and inside. Chocolate on chocolate on chocolate. Need we say more?',
    price: 105,
    emoji: '🍪',
    tag: 'Popular',
    tagColor: 'bg-[#1A3A5C]',
  },
];

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
            Each flavour is obsessively developed, tested, and perfected before it earns a spot on our menu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.name}
              className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-6 card-glow group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#C8860A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl float">{p.emoji}</div>
                  <span className={`${p.tagColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {p.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#FDF6EC] mb-2">{p.name}</h3>
                <p className="text-[#FDF6EC]/55 text-sm leading-relaxed mb-6">{p.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#C8860A]">₹{p.price}</span>
                    <span className="text-[#FDF6EC]/40 text-xs ml-1">per piece</span>
                  </div>
                  <Link
                    href="/order"
                    className="bg-[#C8860A]/20 hover:bg-[#C8860A] text-[#C8860A] hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                  >
                    Add to Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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
