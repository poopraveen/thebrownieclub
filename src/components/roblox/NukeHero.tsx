import Link from 'next/link';

export function NukeHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[#0A0A0F] pt-20">
      {/* Glow orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/8 rounded-full blur-3xl" />
      </div>
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-sm font-mono tracking-widest uppercase">Roblox · Nuclear Strike System · v1.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
          <span className="block text-white">☢️ Nuclear</span>
          <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Strike System</span>
        </h1>

        <p className="text-[#94A3B8] text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Complete production-ready Roblox multiplayer nuclear system — server-authoritative, anti-exploit secured,
          optimized for 30+ players, with full visual effects, audio, UI, and admin controls.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {['Lua 5.1', 'Server-Auth', '30+ Players', 'Anti-Exploit', 'Optimized VFX', 'Admin System'].map((tag) => (
            <span key={tag} className="bg-[#1E293B] border border-[#334155] text-[#94A3B8] text-xs font-mono px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { num: '6', label: 'Lua Scripts' },
            { num: '30+', label: 'Player Support' },
            { num: '400', label: 'Blast Radius (studs)' },
            { num: '10m', label: 'Cooldown Timer' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111827] border border-[#1F2937] rounded-xl p-4">
              <div className="text-2xl font-black text-red-400">{s.num}</div>
              <div className="text-[#6B7280] text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
