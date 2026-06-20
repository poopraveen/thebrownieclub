const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Koramangala',
    text: 'Absolute game changer. The salted caramel brownie is insane — I order every week without fail.',
    stars: 5,
    initial: 'P',
  },
  {
    name: 'Rahul Verma',
    location: 'Indiranagar',
    text: 'Best brownies in Bangalore, no contest. The texture is perfect — fudgy inside with a crackly top. 10/10.',
    stars: 5,
    initial: 'R',
  },
  {
    name: 'Ananya Krishnan',
    location: 'HSR Layout',
    text: 'Ordered a gift box for my friend\'s birthday. The packaging was gorgeous and the brownies disappeared in minutes!',
    stars: 5,
    initial: 'A',
  },
  {
    name: 'Karthik Nair',
    location: 'Whitefield',
    text: 'The Nutella stuffed brownie is the best thing I\'ve eaten in Bangalore. I\'m not exaggerating.',
    stars: 5,
    initial: 'K',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#0D0500]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Love from Bangalore</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FDF6EC]">
            The Club <span className="gradient-text">Speaks</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8 card-glow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-[#C8860A] text-lg">★</span>
                ))}
              </div>
              <p className="text-[#FDF6EC]/80 text-lg leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8860A] flex items-center justify-center text-white font-bold">
                  {t.initial}
                </div>
                <div>
                  <div className="text-[#FDF6EC] font-semibold">{t.name}</div>
                  <div className="text-[#FDF6EC]/40 text-sm">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
