-- ============================================================
-- RemoteSetup.server.lua  |  Script
-- Place: ServerScriptService > RemoteSetup
-- Runs FIRST — creates all RemoteEvents and folders so
-- every other script can WaitForChild() reliably.
-- ============================================================

local RS = game:GetService("ReplicatedStorage")

-- Create NukeSystem folder hierarchy
local function GetOrCreate(parent, name, class)
    local existing = parent:FindFirstChild(name)
    if existing then return existing end
    local obj      = Instance.new(class or "Folder")
    obj.Name       = name
    obj.Parent     = parent
    return obj
end

local nukeSystem    = GetOrCreate(RS,          "NukeSystem",   "Folder")
local remotes       = GetOrCreate(nukeSystem,  "RemoteEvents", "Folder")
local modules       = GetOrCreate(nukeSystem,  "Modules",      "Folder")

local EVENTS = {
    "LaunchNuke",    -- Client → Server : request launch
    "NukeWarning",   -- Server → All    : siren + countdown
    "NukeImpact",    -- Server → All    : VFX at detonation
    "NukeDamage",    -- Server → Client : notify of hp loss
    "CancelNuke",    -- Admin → Server  : cancel active nuke
    "NukeStatus",    -- Server → Client : cooldown / error msg
}

for _, name in ipairs(EVENTS) do
    GetOrCreate(remotes, name, "RemoteEvent")
end

print("[RemoteSetup] ✅ All RemoteEvents created.")

-- ── Give starter coins so players can test immediately ──────
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    -- Create leaderstats (if your game doesn't already have them)
    local ls = player:FindFirstChild("leaderstats")
    if not ls then
        ls      = Instance.new("Folder")
        ls.Name = "leaderstats"
        ls.Parent = player
    end

    local coins = ls:FindFirstChild("Coins")
    if not coins then
        coins       = Instance.new("IntValue")
        coins.Name  = "Coins"
        coins.Value = 10000    -- start with plenty for testing
        coins.Parent = ls
    end
end)
