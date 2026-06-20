import { NukeHero } from '@/components/roblox/NukeHero';
import { NukeArchitecture } from '@/components/roblox/NukeArchitecture';
import { NukeFolderStructure } from '@/components/roblox/NukeFolderStructure';
import { NukeScripts } from '@/components/roblox/NukeScripts';
import { NukeImplementation } from '@/components/roblox/NukeImplementation';
import { NukeChecklist } from '@/components/roblox/NukeChecklist';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roblox Nuclear Strike System | Dev Docs',
  description: 'Complete production-ready Roblox Nuclear Strike System — full Lua scripts, architecture, RemoteEvents, security, and UI.',
};

export default function RobloxNukePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E2E8F0]">
      <NukeHero />
      <NukeArchitecture />
      <NukeFolderStructure />
      <NukeScripts />
      <NukeImplementation />
      <NukeChecklist />
    </div>
  );
}
