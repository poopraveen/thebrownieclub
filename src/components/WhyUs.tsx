const reasons = [
  {
    icon: '🍫',
    title: 'Belgian Chocolate',
    description: 'We use only 70% Callebaut Belgian chocolate — no shortcuts, no compromises.',
  },
  {
    icon: '🌅',
    title: 'Baked Fresh Daily',
    description: 'Every batch is baked fresh every morning. No preservatives, no yesterday\'s brownies.',
  },
  {
    icon: '🏡',
    title: 'Made with Love',
    description: 'Small-batch, handcrafted production means every brownie gets personal attention.',
  },
  {
    icon: '🚴',
    title: 'Bangalore Delivery',
    description: 'Fast delivery across Indiranagar, Koramangala, HSR, Whitefield, and more.',
  },
  {
    icon: '🎁',
    title: 'Custom Gift Boxes',
    description: 'Beautiful packaging for birthdays, celebrations, and corporate gifting.',
  },
  {
    icon: '⭐',
    title: '500+ Happy Customers',
    description: 'Loved by brownie obsessives across Bangalore. Join the club.',
  },
];

export function WhyUs() {
  return (
    <section className="py-24 px-6 bg-[#080200]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Why The Brownie Club</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FDF6EC]">
            We Take <span className="gradient-text">Brownies Seriously</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r) => (
            <div key={r.title} className="text-center group p-8 rounded-2xl border border-[#C8860A]/10 hover:border-[#C8860A]/30 transition-all hover:bg-[#C8860A]/5">
              <div className="text-5xl mb-4 float">{r.icon}</div>
              <h3 className="text-lg font-bold text-[#FDF6EC] mb-3">{r.title}</h3>
              <p className="text-[#FDF6EC]/55 text-sm leading-relaxed">{r.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
