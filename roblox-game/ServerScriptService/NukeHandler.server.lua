-- ============================================================
-- NukeHandler.server.lua  |  Script  (SERVER ONLY)
-- Place: ServerScriptService > NukeHandler
-- ============================================================

local Players      = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local Debris       = game:GetService("Debris")
local RunService   = game:GetService("RunService")

-- Wait for ReplicatedStorage setup
local RS           = game:GetService("ReplicatedStorage")
local NukeSystem   = RS:WaitForChild("NukeSystem", 10)
local Remotes      = NukeSystem:WaitForChild("RemoteEvents", 10)
local Modules      = NukeSystem:WaitForChild("Modules", 10)

local Config       = require(Modules:WaitForChild("NukeConfig"))
local Security     = require(Modules:WaitForChild("NukeSecurity"))

-- RemoteEvents
local RE_Launch    = Remotes:WaitForChild("LaunchNuke")
local RE_Warning   = Remotes:WaitForChild("NukeWarning")
local RE_Impact    = Remotes:WaitForChild("NukeImpact")
local RE_Damage    = Remotes:WaitForChild("NukeDamage")
local RE_Status    = Remotes:WaitForChild("NukeStatus")
local RE_Cancel    = Remotes:WaitForChild("CancelNuke")

local isCancelled  = false

-- ─────────────────────────────────────────────────────────────
-- Helper: all players within a radius of a point
-- ─────────────────────────────────────────────────────────────
local function PlayersInRadius(center, radius)
    local list = {}
    for _, p in ipairs(Players:GetPlayers()) do
        local char = p.Character
        if char then
            local hrp = char:FindFirstChild("HumanoidRootPart")
            if hrp and (hrp.Position - center).Magnitude <= radius then
                table.insert(list, { player = p, dist = (hrp.Position - center).Magnitude })
            end
        end
    end
    return list
end

-- ─────────────────────────────────────────────────────────────
-- Helper: apply damage by blast zone  (server-authoritative)
-- ─────────────────────────────────────────────────────────────
local function ApplyDamage(impactPos)
    local maxRadius = Config.ZONES[#Config.ZONES].maxRadius
    for _, data in ipairs(PlayersInRadius(impactPos, maxRadius)) do
        local dmg = 0
        for _, zone in ipairs(Config.ZONES) do
            if data.dist <= zone.maxRadius then
                dmg = zone.damage
                break
            end
        end
        if dmg > 0 then
            local char = data.player.Character
            if char then
                local hum = char:FindFirstChildOfClass("Humanoid")
                if hum and hum.Health > 0 then
                    if dmg == math.huge then
                        hum.Health = 0
                    else
                        hum:TakeDamage(dmg)
                    end
                    RE_Damage:FireClient(data.player, dmg, data.dist)
                end
            end
        end
    end
end

-- ─────────────────────────────────────────────────────────────
-- Helper: destroy tagged destructible props
-- ─────────────────────────────────────────────────────────────
local function DestroyProps(impactPos)
    for _, obj in ipairs(workspace:GetDescendants()) do
        if obj:IsA("Model") and obj:GetAttribute("Destructible") == true then
            local primary = obj.PrimaryPart or obj:FindFirstChildWhichIsA("BasePart")
            if primary then
                local dist = (primary.Position - impactPos).Magnitude
                if dist <= Config.DEBRIS_DESTROY_RADIUS then
                    -- Stagger destruction so server doesn't spike
                    task.delay((dist / Config.DEBRIS_DESTROY_RADIUS) * 2, function()
                        if obj and obj.Parent then
                            obj:Destroy()
                        end
                    end)
                end
            end
        end
    end
end

-- ─────────────────────────────────────────────────────────────
-- Helper: spawn scorch mark on the ground
-- ─────────────────────────────────────────────────────────────
local function SpawnScorch(pos)
    local p = Instance.new("Part")
    p.Name        = "NukeScorch"
    p.Anchored    = true
    p.CanCollide  = false
    p.CastShadow  = false
    p.Size        = Vector3.new(Config.SCORCH_RADIUS * 2, 0.2, Config.SCORCH_RADIUS * 2)
    p.Position    = Vector3.new(pos.X, 0.15, pos.Z)
    p.Material    = Enum.Material.SmoothPlastic
    p.Color       = Color3.fromRGB(18, 12, 8)
    p.Transparency= 0.15
    p.Parent      = workspace

    local decal       = Instance.new("Decal")
    decal.Texture     = "rbxassetid://168143648"
    decal.Face        = Enum.NormalId.Top
    decal.Transparency= 0.3
    decal.Parent      = p

    Debris:AddItem(p, 300)   -- auto-remove after 5 min
end

-- ─────────────────────────────────────────────────────────────
-- Main nuke sequence
-- ─────────────────────────────────────────────────────────────
local function ExecuteNuke(targetPos)
    isCancelled = false
    Security.SetActiveNukes(1)

    -- ── 1. Spawn missile ─────────────────────────────────────
    local spawnPos = Vector3.new(targetPos.X, targetPos.Y + Config.MISSILE_SPAWN_HEIGHT, targetPos.Z)

    local missile       = Instance.new("Part")
    missile.Name        = "NukeMissile"
    missile.Size        = Vector3.new(4, 14, 4)
    missile.Shape       = Enum.PartType.Cylinder
    missile.Position    = spawnPos
    missile.Anchored    = true
    missile.CanCollide  = false
    missile.CastShadow  = false
    missile.Material    = Enum.Material.Metal
    missile.Color       = Color3.fromRGB(190, 190, 200)
    missile.Parent      = workspace

    -- Warhead tip
    local tip       = Instance.new("SpecialMesh")
    tip.MeshType    = Enum.MeshType.Sphere
    tip.Scale       = Vector3.new(1.2, 0.6, 1.2)
    tip.Parent      = missile

    -- Exhaust trail
    local a0 = Instance.new("Attachment", missile)
    local a1 = Instance.new("Attachment", missile)
    a0.Position = Vector3.new(0,  7, 0)
    a1.Position = Vector3.new(0, -7, 0)

    local trail             = Instance.new("Trail")
    trail.Attachment0       = a0
    trail.Attachment1       = a1
    trail.Lifetime          = 4
    trail.MinLength         = 0
    trail.Color             = ColorSequence.new({
        ColorSequenceKeypoint.new(0,   Color3.fromRGB(255, 140, 30)),
        ColorSequenceKeypoint.new(0.4, Color3.fromRGB(180, 80,  10)),
        ColorSequenceKeypoint.new(1,   Color3.fromRGB(80,  70,  60)),
    })
    trail.Transparency      = NumberSequence.new({
        NumberSequenceKeypoint.new(0, 0),
        NumberSequenceKeypoint.new(1, 1),
    })
    trail.WidthScale        = NumberSequence.new(3)
    trail.FaceCamera        = true
    trail.Parent            = missile

    -- Rocket exhaust smoke
    local exhaustSmoke            = Instance.new("ParticleEmitter")
    exhaustSmoke.Texture          = "rbxassetid://3166619987"
    exhaustSmoke.Rate             = 80
    exhaustSmoke.Lifetime         = NumberRange.new(1, 3)
    exhaustSmoke.Speed            = NumberRange.new(10, 30)
    exhaustSmoke.SpreadAngle      = Vector2.new(15, 15)
    exhaustSmoke.Color            = ColorSequence.new({
        ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 200, 50)),
        ColorSequenceKeypoint.new(1, Color3.fromRGB(60, 55, 50)),
    })
    exhaustSmoke.Size             = NumberSequence.new({
        NumberSequenceKeypoint.new(0, 2),
        NumberSequenceKeypoint.new(1, 12),
    })
    exhaustSmoke.Transparency     = NumberSequence.new({
        NumberSequenceKeypoint.new(0, 0.2),
        NumberSequenceKeypoint.new(1, 1),
    })
    exhaustSmoke.LightEmission    = 0.6
    exhaustSmoke.Parent           = a1

    -- ── 2. Broadcast global warning ──────────────────────────
    RE_Warning:FireAllClients("WARNING", {
        targetPos  = targetPos,
        countdown  = Config.WARNING_DURATION,
        missilePos = spawnPos,
    })

    -- ── 3. Tween missile toward ground ───────────────────────
    local tween = TweenService:Create(
        missile,
        TweenInfo.new(Config.MISSILE_TRAVEL_TIME, Enum.EasingStyle.Linear),
        { Position = targetPos }
    )
    tween:Play()

    -- Wait (check for cancellation every 0.1s)
    local t = 0
    while t < Config.MISSILE_TRAVEL_TIME do
        task.wait(0.1)
        t = t + 0.1
        if isCancelled then
            tween:Cancel()
            missile:Destroy()
            Security.SetActiveNukes(0)
            RE_Warning:FireAllClients("CANCEL", {})
            return
        end
    end

    -- ── 4. Impact ────────────────────────────────────────────
    missile:Destroy()

    -- Notify all clients → trigger VFX
    RE_Impact:FireAllClients({
        position        = targetPos,
        shockwaveRadius = Config.SHOCKWAVE_MAX_RADIUS,
        shakeDist       = Config.CAMERA_SHAKE_DIST,
        mushHeight      = Config.MUSHROOM_HEIGHT,
        shockDuration   = Config.SHOCKWAVE_DURATION,
        flashDuration   = Config.FLASH_DURATION,
    })

    -- Server-side: damage + destroy + scorch
    task.spawn(ApplyDamage,   targetPos)
    task.spawn(DestroyProps,  targetPos)
    task.spawn(SpawnScorch,   targetPos)

    -- ── 5. Cleanup ───────────────────────────────────────────
    task.wait(2)
    Security.SetActiveNukes(0)
end

-- ─────────────────────────────────────────────────────────────
-- RemoteEvent: player requests nuke launch
-- ─────────────────────────────────────────────────────────────
RE_Launch.OnServerEvent:Connect(function(player, targetPos)
    local ok, reason = Security.CanLaunch(player, targetPos)

    if not ok then
        RE_Status:FireClient(player, { success = false, reason = reason })
        return
    end

    -- Deduct cost and set cooldown before launch
    Security.DeductCoins(player, Config.NUKE_COST)
    Security.SetCooldown(player)

    RE_Status:FireClient(player, { success = true })

    task.spawn(ExecuteNuke, targetPos)
end)

-- ─────────────────────────────────────────────────────────────
-- RemoteEvent: admin cancels active nuke
-- ─────────────────────────────────────────────────────────────
RE_Cancel.OnServerEvent:Connect(function(player)
    if not Security.IsAdmin(player) then
        warn("[Security] Unauthorised cancel by:", player.Name)
        return
    end
    isCancelled = true
end)

-- ─────────────────────────────────────────────────────────────
-- Admin chat command:  !nuke <X> <Z>
-- ─────────────────────────────────────────────────────────────
Players.PlayerAdded:Connect(function(player)
    player.Chatted:Connect(function(msg)
        if not Security.IsAdmin(player) then return end

        local x, z = msg:match("^" .. Config.ADMIN_CHAT_CMD .. "%s+(%-?%d+)%s+(%-?%d+)$")
        if x and z then
            task.spawn(ExecuteNuke, Vector3.new(tonumber(x), 0, tonumber(z)))
        elseif msg == Config.ADMIN_CHAT_CMD .. " cancel" then
            isCancelled = true
        end
    end)
end)

print("[NukeHandler] ✅ Nuclear Strike System ready.")
