const flow = [
  { step: '01', title: 'Player Triggers Nuke', desc: 'Player clicks target on map using Launch Device. Client fires RemoteEvent to server.', icon: '🎯', color: 'border-blue-500/40 bg-blue-500/5' },
  { step: '02', title: 'Server Validates Request', desc: 'Server checks cooldown, currency balance, active nuke limit, and player permissions. Rejects exploiters silently.', icon: '🔒', color: 'border-yellow-500/40 bg-yellow-500/5' },
  { step: '03', title: 'Missile Spawns & Travels', desc: 'Missile spawns 2000 studs above target. Tween moves it toward ground. Launch sound + travel sound activated globally.', icon: '🚀', color: 'border-orange-500/40 bg-orange-500/5' },
  { step: '04', title: 'Global Warning System', desc: 'Nuclear siren fires for all clients. Countdown UI appears on every screen. Blast radius indicator shown on target.', icon: '⚠️', color: 'border-red-500/40 bg-red-500/5' },
  { step: '05', title: 'Impact & Explosion', desc: 'Missile reaches target. Server calculates damage per blast zone. Flash effect fires client-side. Mushroom cloud spawns.', icon: '💥', color: 'border-red-600/40 bg-red-600/5' },
  { step: '06', title: 'Shockwave & Aftermath', desc: 'Expanding shockwave ring destroys buildings. Camera shake propagates to all clients. Ground scorch mark persists.', icon: '🌊', color: 'border-purple-500/40 bg-purple-500/5' },
];

const remoteEvents = [
  { name: 'LaunchNuke', dir: 'Client → Server', desc: 'Request nuke launch at target Vector3' },
  { name: 'NukeWarning', dir: 'Server → All Clients', desc: 'Trigger siren + countdown UI globally' },
  { name: 'NukeImpact', dir: 'Server → All Clients', desc: 'Trigger flash, shake, mushroom cloud VFX' },
  { name: 'NukeDamage', dir: 'Server → Affected Clients', desc: 'Notify clients of damage received' },
  { name: 'CancelNuke', dir: 'Admin → Server', desc: 'Admin command to cancel active nuke' },
  { name: 'NukeStatus', dir: 'Server → Client', desc: 'Sync cooldown and active nuke state' },
];

export function NukeArchitecture() {
  return (
    <section className="py-20 px-6 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        <SectionHeader label="Architecture" title="Gameplay Flow" subtitle="Server-authoritative pipeline with anti-exploit validation at every step" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {flow.map((f) => (
            <div key={f.step} className={`border rounded-2xl p-6 ${f.color}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <span className="text-[#6B7280] text-xs font-mono">STEP {f.step}</span>
                  <h3 className="font-bold text-white text-sm mt-0.5">{f.title}</h3>
                </div>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <SectionHeader label="Network Layer" title="RemoteEvents Setup" subtitle="All client-server communication is routed through validated RemoteEvents" />

        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 gap-0 border-b border-[#1F2937] px-6 py-3">
            <span className="text-[#6B7280] text-xs font-mono uppercase">Event Name</span>
            <span className="text-[#6B7280] text-xs font-mono uppercase">Direction</span>
            <span className="text-[#6B7280] text-xs font-mono uppercase">Purpose</span>
          </div>
          {remoteEvents.map((e, i) => (
            <div key={e.name} className={`grid grid-cols-3 gap-0 px-6 py-3 ${i % 2 === 0 ? 'bg-[#0F1923]' : ''} border-b border-[#1F2937]/50`}>
              <span className="text-red-400 font-mono text-sm">{e.name}</span>
              <span className="text-blue-400 text-xs font-mono self-center">{e.dir}</span>
              <span className="text-[#94A3B8] text-sm">{e.desc}</span>
            </div>
          ))}
        </div>

        {/* Blast zones */}
        <div className="mt-16">
          <SectionHeader label="Damage System" title="Blast Radius Zones" subtitle="Server calculates all damage — clients cannot spoof positions" />
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { zone: 'Zone 1', range: '0 – 100 studs', damage: 'Instant Death', color: 'bg-red-600', bar: 'w-full' },
              { zone: 'Zone 2', range: '100 – 250 studs', damage: '75 Damage', color: 'bg-orange-500', bar: 'w-3/4' },
              { zone: 'Zone 3', range: '250 – 400 studs', damage: '40 Damage', color: 'bg-yellow-500', bar: 'w-1/2' },
              { zone: 'Zone 4', range: '400+ studs', damage: '✅ Safe Zone', color: 'bg-green-600', bar: 'w-1/4' },
            ].map((z) => (
              <div key={z.zone} className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
                <div className="text-[#6B7280] text-xs font-mono mb-1">{z.zone}</div>
                <div className="font-bold text-white mb-1">{z.damage}</div>
                <div className="text-[#6B7280] text-xs mb-3">{z.range}</div>
                <div className="w-full bg-[#1E293B] rounded-full h-1.5">
                  <div className={`${z.color} ${z.bar} h-1.5 rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">{label}</p>
      <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{title}</h2>
      <p className="text-[#64748B]">{subtitle}</p>
    </div>
  );
}
