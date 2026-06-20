-- ============================================================
-- NukeConfig.lua  |  ModuleScript
-- Place: ReplicatedStorage > NukeSystem > Modules > NukeConfig
-- ============================================================

local NukeConfig = {}

-- ── Gameplay ─────────────────────────────────────────────────
NukeConfig.COOLDOWN_SECONDS      = 600      -- 10 minutes
NukeConfig.NUKE_COST             = 5000     -- in-game currency
NukeConfig.MAX_ACTIVE_NUKES      = 1
NukeConfig.MISSILE_SPAWN_HEIGHT  = 2000     -- studs above target
NukeConfig.MISSILE_TRAVEL_TIME   = 12       -- seconds to impact
NukeConfig.WARNING_DURATION      = 15       -- siren countdown duration

-- ── Blast Damage Zones ───────────────────────────────────────
NukeConfig.ZONES = {
    { maxRadius = 100,  damage = math.huge }, -- instant kill
    { maxRadius = 250,  damage = 75        },
    { maxRadius = 400,  damage = 40        },
    -- beyond 400 = safe
}

-- ── Visual ───────────────────────────────────────────────────
NukeConfig.SCORCH_RADIUS         = 180
NukeConfig.SHOCKWAVE_MAX_RADIUS  = 450
NukeConfig.SHOCKWAVE_DURATION    = 3.5
NukeConfig.MUSHROOM_HEIGHT       = 500
NukeConfig.FLASH_DURATION        = 0.8
NukeConfig.CAMERA_SHAKE_DIST     = 600
NukeConfig.DEBRIS_DESTROY_RADIUS = 300

-- ── Sound Asset IDs  (replace with your own uploads) ─────────
NukeConfig.SND_LAUNCH      = "rbxassetid://1369158361"
NukeConfig.SND_TRAVEL      = "rbxassetid://2845766501"
NukeConfig.SND_SIREN       = "rbxassetid://130766067"
NukeConfig.SND_EXPLOSION   = "rbxassetid://3375826698"
NukeConfig.SND_SHOCKWAVE   = "rbxassetid://2691586720"

-- ── Admin ─────────────────────────────────────────────────────
NukeConfig.ADMIN_IDS = {
    123456789,   -- ← replace with your Roblox UserId
}
NukeConfig.ADMIN_CHAT_CMD = "!nuke"   -- usage: !nuke 0 0  (X Z coords)

return NukeConfig
