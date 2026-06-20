-- ============================================================
-- NukeSecurity.lua  |  ModuleScript
-- Place: ReplicatedStorage > NukeSystem > Modules > NukeSecurity
-- ============================================================

local NukeSecurity = {}

local Config          = require(script.Parent.NukeConfig)
local playerCooldowns = {}   -- [UserId] = tick() of last launch
local lastRequests    = {}   -- [UserId] = tick() for rate-limit
local activeNukes     = 0

-- ── Internal setters (called by NukeHandler) ─────────────────
function NukeSecurity.SetActiveNukes(n)   activeNukes = n end
function NukeSecurity.SetCooldown(player) playerCooldowns[player.UserId] = tick() end
function NukeSecurity.ClearCooldown(player) playerCooldowns[player.UserId] = nil end

-- ── Main validation ──────────────────────────────────────────
function NukeSecurity.CanLaunch(player, targetPos)
    local now = tick()

    -- 1. Rate-limit: max 1 request per 5 seconds
    if now - (lastRequests[player.UserId] or 0) < 5 then
        warn("[Security] Rate-limit hit:", player.Name)
        return false, "Too many requests. Slow down."
    end
    lastRequests[player.UserId] = now

    -- 2. Only one active nuke allowed
    if activeNukes >= Config.MAX_ACTIVE_NUKES then
        return false, "A nuke is already active!"
    end

    -- 3. Cooldown
    local sinceLastLaunch = now - (playerCooldowns[player.UserId] or 0)
    if sinceLastLaunch < Config.COOLDOWN_SECONDS then
        local rem = math.ceil(Config.COOLDOWN_SECONDS - sinceLastLaunch)
        local mins = math.floor(rem / 60)
        local secs = rem % 60
        return false, string.format("Cooldown: %d:%02d remaining", mins, secs)
    end

    -- 4. Validate position type
    if typeof(targetPos) ~= "Vector3" then
        warn("[Security] Bad targetPos type from:", player.Name)
        return false, "Invalid target position."
    end

    -- 5. Map bounds check  (adjust MAP_LIMIT to your world size)
    local MAP_LIMIT = 8000
    if math.abs(targetPos.X) > MAP_LIMIT or math.abs(targetPos.Z) > MAP_LIMIT then
        warn("[Security] Out-of-bounds from:", player.Name)
        return false, "Target is outside the map!"
    end

    -- 6. Currency check
    local coins = NukeSecurity.GetCoins(player)
    if coins < Config.NUKE_COST then
        return false, string.format("Need %d coins (you have %d)", Config.NUKE_COST, coins)
    end

    return true, "OK"
end

-- ── Admin check ───────────────────────────────────────────────
function NukeSecurity.IsAdmin(player)
    for _, id in ipairs(Config.ADMIN_IDS) do
        if player.UserId == id then return true end
    end
    return false
end

-- ── Currency helpers (adapt to your DataStore) ────────────────
function NukeSecurity.GetCoins(player)
    local ls = player:FindFirstChild("leaderstats")
    if ls then
        local coins = ls:FindFirstChild("Coins")
        if coins then return coins.Value end
    end
    return 0
end

function NukeSecurity.DeductCoins(player, amount)
    local ls = player:FindFirstChild("leaderstats")
    if ls then
        local coins = ls:FindFirstChild("Coins")
        if coins then
            coins.Value = math.max(0, coins.Value - amount)
        end
    end
end

return NukeSecurity
