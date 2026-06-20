import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0500] pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <span className="text-7xl block mb-6">🍫</span>
          <p className="text-[#C8860A] text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#FDF6EC] mb-6">
            Born from a <span className="gradient-text">Love of Chocolate</span>
          </h1>
          <p className="text-[#FDF6EC]/60 text-xl leading-relaxed max-w-2xl mx-auto">
            The Brownie Club started in a Bangalore home kitchen in 2022, with one mission: make the best brownie anyone in the city had ever tasted.
          </p>
        </div>

        {/* Story sections */}
        <div className="space-y-16">
          <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#C8860A] mb-4">How It Started</h2>
            <p className="text-[#FDF6EC]/70 leading-relaxed text-lg">
              What began as weekend baking sessions turned into something much bigger. After sharing brownies with friends and getting the same reaction every time — &ldquo;you need to sell these&rdquo; — we decided to take the leap.
            </p>
            <p className="text-[#FDF6EC]/70 leading-relaxed text-lg mt-4">
              We spent months obsessing over the perfect recipe. We tried 47 versions of our classic dark chocolate brownie before we were satisfied. That&apos;s the standard we hold every flavour to.
            </p>
          </div>

          <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#C8860A] mb-4">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                { title: 'No Shortcuts', desc: 'Belgian chocolate only. Real butter. Farm eggs. Always.', emoji: '✨' },
                { title: 'Small Batches', desc: 'We bake small to maintain quality. Every brownie matters.', emoji: '🏡' },
                { title: 'Fresh Always', desc: 'Baked every morning. No brownies from yesterday, ever.', emoji: '🌅' },
              ].map((item) => (
                <div key={item.title} className="text-center p-4">
                  <div className="text-4xl mb-3">{item.emoji}</div>
                  <h3 className="font-bold text-[#FDF6EC] mb-2">{item.title}</h3>
                  <p className="text-[#FDF6EC]/55 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A0A00] border border-[#C8860A]/15 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#C8860A] mb-4">Based in Bangalore</h2>
            <p className="text-[#FDF6EC]/70 leading-relaxed text-lg">
              We&apos;re proudly Bangalore-born. Based out of Indiranagar, we deliver across the city — from Koramangala to Whitefield, HSR to Jayanagar. Bangalore&apos;s brownie obsessives are our community, and we&apos;re grateful every day for the love you&apos;ve shown us.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/order"
            className="bg-[#C8860A] hover:bg-[#E8A020] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#C8860A]/30 inline-block"
          >
            Try Our Brownies →
          </Link>
        </div>
      </div>
    </div>
  );
}
