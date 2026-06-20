const tree = [
  { indent: 0, icon: '📁', name: 'Game', type: '' },
  { indent: 1, icon: '📁', name: 'ServerScriptService', type: '' },
  { indent: 2, icon: '📜', name: 'NukeHandler.server.lua', type: 'Script', desc: 'Main server logic & validation' },
  { indent: 2, icon: '📜', name: 'AdminCommands.server.lua', type: 'Script', desc: 'Admin nuke commands' },
  { indent: 1, icon: '📁', name: 'StarterPlayerScripts', type: '' },
  { indent: 2, icon: '📜', name: 'NukeClient.client.lua', type: 'LocalScript', desc: 'VFX, camera shake, flash' },
  { indent: 2, icon: '📜', name: 'NukeUI.client.lua', type: 'LocalScript', desc: 'Countdown, warning banner, cooldown' },
  { indent: 2, icon: '📜', name: 'LaunchDevice.client.lua', type: 'LocalScript', desc: 'Mouse targeting, launch device tool' },
  { indent: 1, icon: '📁', name: 'ReplicatedStorage', type: '' },
  { indent: 2, icon: '📁', name: 'NukeSystem', type: '' },
  { indent: 3, icon: '📂', name: 'RemoteEvents', type: '' },
  { indent: 4, icon: '⚡', name: 'LaunchNuke', type: 'RemoteEvent' },
  { indent: 4, icon: '⚡', name: 'NukeWarning', type: 'RemoteEvent' },
  { indent: 4, icon: '⚡', name: 'NukeImpact', type: 'RemoteEvent' },
  { indent: 4, icon: '⚡', name: 'NukeDamage', type: 'RemoteEvent' },
  { indent: 4, icon: '⚡', name: 'CancelNuke', type: 'RemoteEvent' },
  { indent: 4, icon: '⚡', name: 'NukeStatus', type: 'RemoteEvent' },
  { indent: 3, icon: '📂', name: 'Modules', type: '' },
  { indent: 4, icon: '🔧', name: 'NukeConfig.lua', type: 'ModuleScript', desc: 'All tunable constants' },
  { indent: 4, icon: '🔧', name: 'NukeEffects.lua', type: 'ModuleScript', desc: 'VFX factory functions' },
  { indent: 4, icon: '🔧', name: 'NukeSecurity.lua', type: 'ModuleScript', desc: 'Validation & anti-exploit' },
  { indent: 3, icon: '📂', name: 'Assets', type: '' },
  { indent: 4, icon: '🎵', name: 'Sounds', type: 'Folder' },
  { indent: 4, icon: '✨', name: 'Particles', type: 'Folder' },
  { indent: 4, icon: '🖼️', name: 'UI', type: 'Folder' },
];

const typeColors: Record<string, string> = {
  Script: 'text-green-400 bg-green-400/10 border-green-400/30',
  LocalScript: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  ModuleScript: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  RemoteEvent: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Folder: 'text-[#94A3B8] bg-[#1E293B] border-[#334155]',
};

export function NukeFolderStructure() {
  return (
    <section className="py-20 px-6 bg-[#050508]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">Project Layout</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Folder Structure</h2>
          <p className="text-[#64748B]">Complete Roblox Studio hierarchy — copy this structure exactly into your game</p>
        </div>

        <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-[#21262D]">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[#6B7280] text-xs font-mono ml-2">Roblox Studio — Explorer</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-0.5">
            {tree.map((item, i) => (
              <div key={i} className="flex items-center gap-2 py-0.5 hover:bg-[#1C2128] rounded px-2 transition-colors group">
                <span style={{ marginLeft: `${item.indent * 20}px` }} className="flex items-center gap-2 flex-1">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className={item.type ? 'text-[#E6EDF3]' : 'text-[#58A6FF] font-semibold'}>{item.name}</span>
                  {item.type && (
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${typeColors[item.type] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'}`}>
                      {item.type}
                    </span>
                  )}
                </span>
                {item.desc && (
                  <span className="text-[#484F58] text-xs hidden group-hover:block">{item.desc}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6">
          {Object.entries(typeColors).map(([type, cls]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded border font-mono ${cls}`}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
