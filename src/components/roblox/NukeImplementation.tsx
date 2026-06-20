const steps = [
  {
    n: '01',
    title: 'Create Folder Structure',
    items: [
      'In Roblox Studio Explorer, create: ReplicatedStorage > NukeSystem > RemoteEvents',
      'Create folder: ReplicatedStorage > NukeSystem > Modules',
      'Create folder: ReplicatedStorage > NukeSystem > Assets > Sounds',
      'Create all 6 RemoteEvents (LaunchNuke, NukeWarning, NukeImpact, NukeDamage, CancelNuke, NukeStatus)',
    ],
  },
  {
    n: '02',
    title: 'Add Module Scripts',
    items: [
      'Create ModuleScript "NukeConfig" in Modules folder — paste NukeConfig.lua code',
      'Create ModuleScript "NukeSecurity" in Modules folder — paste NukeSecurity.lua code',
      'Update ADMIN_IDS in NukeConfig with your real Roblox UserId',
      'Replace audio asset IDs in NukeConfig with your uploaded sound IDs',
    ],
  },
  {
    n: '03',
    title: 'Add Server Script',
    items: [
      'Create Script "NukeHandler" in ServerScriptService — paste NukeHandler.server.lua',
      'Test: Press Play and check Output for "[NukeHandler] Nuclear Strike System loaded ✓"',
      'Verify RemoteEvents are found (no errors about WaitForChild timeouts)',
    ],
  },
  {
    n: '04',
    title: 'Add Local Scripts',
    items: [
      'Create LocalScript "NukeClient" in StarterPlayerScripts — paste NukeClient.client.lua',
      'Create LocalScript "NukeUI" in StarterPlayerScripts — paste NukeUI.client.lua',
      'Create LocalScript "LaunchDevice" in StarterPlayerScripts — paste LaunchDevice.client.lua',
    ],
  },
  {
    n: '05',
    title: 'Create Launch Device Tool',
    items: [
      'Create a Tool in StarterPack and name it exactly "NukeLaunchDevice"',
      'Add a Handle Part inside the tool (any simple mesh works)',
      'Tag buildings you want destroyed with Attribute "Destructible" = true in Properties panel',
      'Give the tool to players via in-game shop or starter pack',
    ],
  },
  {
    n: '06',
    title: 'Connect Currency System',
    items: [
      'In NukeSecurity.lua, update GetCurrency() to read from your DataStore',
      'Update DeductCurrency() to actually deduct from your DataStore',
      'Ensure players have a "leaderstats > Coins" value or adapt to your economy system',
      'Test by giving yourself enough currency and attempting a launch',
    ],
  },
  {
    n: '07',
    title: 'Test & Polish',
    items: [
      'Use Studio local server (2+ players) to test multiplayer warning broadcast',
      'Verify damage zones: stand at 50, 150, 300, 500 studs from impact',
      'Test admin command: chat "!nuke 0 0" to launch at origin',
      'Test cooldown: attempt double-launch (second should be rejected)',
      'Check low-end device performance with particle rate reduction',
    ],
  },
];

const security = [
  { check: 'Rate limiting', desc: 'Max 1 request per 5s per player prevents RemoteEvent spam' },
  { check: 'Server-side damage', desc: 'All health changes done server-side — clients cannot spoof position' },
  { check: 'Position validation', desc: 'targetPos type-checked and map-bounds validated before accepting' },
  { check: 'Single active nuke', desc: 'Server tracks activeNukeCount — concurrent launches rejected' },
  { check: 'Currency deducted server-side', desc: 'Client cannot bypass payment by exploiting the RemoteEvent' },
  { check: 'Admin whitelist by UserId', desc: 'Admin commands check against hardcoded UserId list — not username' },
  { check: 'Silent rejection', desc: 'Exploit attempts are warned server-side but not acknowledged to client' },
  { check: 'No client trust', desc: 'Client only fires targetPos — all game state changes happen on server' },
];

export function NukeImplementation() {
  return (
    <section className="py-20 px-6 bg-[#050508]">
      <div className="max-w-6xl mx-auto">
        {/* Steps */}
        <div className="mb-16">
          <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">Setup Guide</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Step-by-Step Implementation</h2>
          <p className="text-[#64748B] mb-10">Follow in order — each step builds on the previous</p>

          <div className="space-y-4">
            {steps.map((step) => (
              <details key={step.n} className="group bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
                <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#1C2128] transition-colors list-none">
                  <span className="text-red-400 font-black font-mono text-lg w-8 shrink-0">{step.n}</span>
                  <span className="font-bold text-white flex-1">{step.title}</span>
                  <span className="text-[#6B7280] text-sm group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <ul className="px-6 pb-5 pt-1 space-y-2 border-t border-[#1F2937]">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#94A3B8]">
                      <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>

        {/* Security */}
        <div>
          <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">Anti-Exploit</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Security Validations</h2>
          <p className="text-[#64748B] mb-8">Every attack vector is handled server-side</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {security.map((s) => (
              <div key={s.check} className="flex items-start gap-4 bg-[#111827] border border-[#1F2937] rounded-xl p-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-sm">{s.check}</div>
                  <div className="text-[#64748B] text-xs mt-0.5">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
