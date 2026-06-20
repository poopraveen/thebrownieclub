# ☢ Nuclear Strike System — Roblox Studio Setup

## Step 1 — Create folder structure in ReplicatedStorage

```
ReplicatedStorage
└── NukeSystem
    ├── RemoteEvents   (Folder — auto-created by RemoteSetup.server.lua)
    └── Modules        (Folder — add ModuleScripts here manually)
```

## Step 2 — Add ModuleScripts to Modules folder

| File | Type | Location |
|------|------|----------|
| NukeConfig.lua | ModuleScript | ReplicatedStorage/NukeSystem/Modules/ |
| NukeSecurity.lua | ModuleScript | ReplicatedStorage/NukeSystem/Modules/ |

## Step 3 — Add Server Scripts

| File | Type | Location |
|------|------|----------|
| RemoteSetup.server.lua | Script | ServerScriptService/ |
| NukeHandler.server.lua | Script | ServerScriptService/ |

> RemoteSetup MUST run before NukeHandler. Rename them so RemoteSetup sorts first, or set RunContext.

## Step 4 — Add LocalScripts

| File | Type | Location |
|------|------|----------|
| NukeClient.client.lua | LocalScript | StarterPlayerScripts/ |
| NukeUI.client.lua | LocalScript | StarterPlayerScripts/ |
| LaunchDevice.client.lua | LocalScript | StarterPlayerScripts/ |

## Step 5 — Create the Launch Device Tool

1. Insert **Tool** into `StarterPack`
2. Rename it exactly: `NukeLaunchDevice`
3. Add a **Part** named `Handle` inside it
4. Paste `NukeLaunchDevice.lua` as a **Script** inside the tool

## Step 6 — Tag destructible buildings

Select any Model you want destroyed by the blast →
Properties panel → Attributes → Add:
- Name: `Destructible`
- Type: `Boolean`
- Value: `true`

## Step 7 — Configure

Open `NukeConfig.lua` and update:
- `ADMIN_IDS` → your Roblox UserId
- Sound asset IDs → your uploaded sounds

## Step 8 — Test

Press **Play** in Studio. Check Output for:
```
[RemoteSetup] ✅ All RemoteEvents created.
[NukeHandler] ✅ Nuclear Strike System ready.
[NukeClient]  ✅ VFX system ready.
[NukeUI]      ✅ UI system ready.
[LaunchDevice]✅ Launch device ready.
```

Pick up the device → click anywhere on the map → confirm dialog → LAUNCH!

## Admin command (in chat)

```
!nuke 0 0          -- launch at X=0, Z=0
!nuke cancel       -- cancel active nuke
```
