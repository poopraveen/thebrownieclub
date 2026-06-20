import Link from 'next/link';

const categories = [
  {
    name: 'Signature Brownies',
    items: [
      { name: 'Classic Dark Chocolate', price: 80, desc: '70% Belgian dark chocolate, dense and fudgy', emoji: '🍫' },
      { name: 'Salted Caramel Swirl', price: 100, desc: 'Caramel ribbons, Himalayan sea salt finish', emoji: '🍮' },
      { name: 'Cream Cheese Marble', price: 110, desc: 'Silky cream cheese swirled through chocolate', emoji: '🌀' },
      { name: 'Walnut Crunch', price: 90, desc: 'Toasted California walnuts in every bite', emoji: '🌰' },
      { name: 'Double Chocolate Chip', price: 95, desc: 'Chocolate dough + chocolate chips = heaven', emoji: '🍪' },
      { name: 'Espresso Chocolate', price: 95, desc: 'Barista-grade espresso meets 70% dark chocolate', emoji: '☕' },
    ],
  },
  {
    name: 'Premium Stuffed',
    items: [
      { name: 'Nutella Stuffed', price: 120, desc: 'Molten Nutella core, dark chocolate shell', emoji: '🫙' },
      { name: 'Biscoff Stuffed', price: 125, desc: 'Caramelised Biscoff butter centre', emoji: '🧡' },
      { name: 'Peanut Butter Core', price: 115, desc: 'Rich peanut butter hidden inside dark brownie', emoji: '🥜' },
    ],
  },
  {
    name: 'Cookies & Specialties',
    items: [
      { name: 'Cookies & Cream', price: 105, desc: 'Oreo crumble on top and throughout', emoji: '🍪' },
      { name: 'Red Velvet Swirl', price: 110, desc: 'Red velvet meets chocolate brownie batter', emoji: '❤️' },
      { name: 'Mango Choco Fusion', price: 115, desc: 'Alphonso mango swirl in chocolate brownie', emoji: '🥭' },
    ],
  },
  {
    name: 'Gift Boxes',
    items: [
      { name: 'Box of 6', price: 500, desc: 'Choose any 6 flavours', emoji: '🎁' },
      { name: 'Box of 12', price: 950, desc: 'Choose any 12 flavours', emoji: '🎀' },
      { name: 'Corporate Box (25+)', price: 2200, desc: 'Custom packaging, minimum 25 pieces', emoji: '🏢' },
    ],
  },
];

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#0D0500] pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">The Full Collection</p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#FDF6EC] mb-4">
            Our <span className="gradient-text">Menu</span>
          </h1>
          <p className="text-[#FDF6EC]/50 max-w-lg mx-auto">
            All brownies baked fresh daily. Minimum order 6 pieces for delivery.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.name} className="mb-16">
            <h2 className="text-2xl font-bold text-[#C8860A] mb-6 pb-3 border-b border-[#C8860A]/20">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <div key={item.name} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-xl p-5 flex items-start gap-4 hover:border-[#C8860A]/40 transition-all card-glow group">
                  <span className="text-3xl float">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-[#FDF6EC]">{item.name}</h3>
                      <span className="text-[#C8860A] font-bold">₹{item.price}</span>
                    </div>
                    <p className="text-[#FDF6EC]/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <Link
            href="/order"
            className="bg-[#C8860A] hover:bg-[#E8A020] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#C8860A]/30 inline-block"
          >
            Place Your Order →
          </Link>
        </div>
      </div>
    </div>
  );
}
