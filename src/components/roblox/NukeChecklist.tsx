const categories = [
  {
    title: 'Functionality',
    color: 'text-blue-400',
    items: [
      'Missile spawns 2000 studs above target and travels to impact point',
      'Nuclear siren plays for ALL players simultaneously',
      'Countdown UI appears on every player screen',
      'Players at 0-100 studs are instantly killed',
      'Players at 100-250 studs take 75 damage',
      'Players at 250-400 studs take 40 damage',
      'Players beyond 400 studs take no damage',
      'Buildings tagged "Destructible" are destroyed within 300 studs',
    ],
  },
  {
    title: 'Visual Effects',
    color: 'text-purple-400',
    items: [
      'Mushroom cloud spawns and grows upward after impact',
      'Shockwave ring expands outward from impact point',
      'White nuclear flash blinds all nearby players briefly',
      'Ground scorch mark (dark circle) remains after explosion',
      'Camera shake scales with distance from impact',
      'Fire and smoke particles visible on mushroom cloud stem',
      'Missile exhaust trail visible during travel phase',
    ],
  },
  {
    title: 'Audio',
    color: 'text-green-400',
    items: [
      'Launch sound plays at moment of firing',
      'Travel sound loops during missile flight',
      'Global siren plays for all players during warning phase',
      'Explosion sound plays at impact point (3D spatial)',
      'Shockwave rumble plays 0.5 seconds after explosion',
      'All sounds stop cleanly on cancel or after impact',
    ],
  },
  {
    title: 'Security & Balance',
    color: 'text-yellow-400',
    items: [
      'Second launch attempt during active nuke is rejected',
      '10-minute cooldown enforced server-side (not just client)',
      'Out-of-bounds target positions are rejected silently',
      'Currency is deducted server-side before launch confirms',
      'Admin command only works for whitelisted UserIds',
      'RemoteEvent spam (< 5s apart) is rate-limited',
      'Client cannot skip cooldown by re-firing RemoteEvent',
    ],
  },
  {
    title: 'Performance',
    color: 'text-red-400',
    items: [
      'Test with 30 players on a local server — frame rate stays above 30fps',
      'Particle emitters clean up after explosion (Debris service)',
      'Mushroom cloud auto-destroys after 2 minutes',
      'No memory leaks: all sound objects destroyed after playing',
      'Building destruction is staggered (not all at once)',
      'Scorch mark auto-cleans after 5 minutes',
    ],
  },
];

export function NukeChecklist() {
  return (
    <section className="py-20 px-6 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">QA</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Testing Checklist</h2>
          <p className="text-[#64748B]">Run through every item before publishing your game</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6">
              <h3 className={`font-bold text-lg mb-4 ${cat.color}`}>{cat.title}</h3>
              <ul className="space-y-2.5">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-4 h-4 border border-[#374151] rounded mt-0.5 shrink-0 flex items-center justify-center">
                      <span className="w-2 h-2 bg-[#1F2937] rounded-sm" />
                    </span>
                    <span className="text-[#94A3B8] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Performance tips */}
        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0A0A0F] border border-red-500/20 rounded-2xl p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            ⚡ Performance Optimization Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'LOD Particles',
                icon: '✨',
                tips: [
                  'Use Config.LOW_QUALITY_PARTICLE_RATE (0.3x) for players with low GraphicsQuality',
                  'Check UserSettings().GameSettings.SavedQualityLevel',
                  'Disable trails on mushroom cloud for < Level 5 graphics',
                ],
              },
              {
                title: 'Server Load',
                icon: '🖥️',
                tips: [
                  'Building destruction is staggered with task.delay()',
                  'Limit GetDescendants() scan to WorkspacePartitions if map is large',
                  'Use CollectionService tags instead of scanning all descendants',
                ],
              },
              {
                title: 'Network',
                icon: '📡',
                tips: [
                  'FireAllClients only sends essential data (position + numbers)',
                  'Do not replicate particle positions — spawn client-side only',
                  'Batch damage notifications into single FireClient call',
                ],
              },
            ].map((tip) => (
              <div key={tip.title}>
                <div className="text-2xl mb-2">{tip.icon}</div>
                <h4 className="font-bold text-white text-sm mb-3">{tip.title}</h4>
                <ul className="space-y-2">
                  {tip.tips.map((t, i) => (
                    <li key={i} className="text-xs text-[#64748B] flex gap-2">
                      <span className="text-red-400 shrink-0">→</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-[#374151] text-sm font-mono">
            ☢️ Nuclear Strike System · Built for Roblox · Server-Authoritative · Anti-Exploit
          </p>
        </div>
      </div>
    </section>
  );
}
