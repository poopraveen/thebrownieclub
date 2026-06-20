'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const scripts = [
  {
    id: 'config',
    label: 'NukeConfig.lua',
    type: 'ModuleScript',
    path: 'ReplicatedStorage/NukeSystem/Modules/',
    desc: 'All tunable constants — edit here without touching game logic',
    color: 'text-purple-400',
    badge: 'bg-purple-400/10 border-purple-400/30 text-purple-400',
    code: `-- NukeConfig.lua (ModuleScript)
-- ReplicatedStorage > NukeSystem > Modules > NukeConfig
-- =====================================================
-- Edit ONLY this file to balance the nuke system

local NukeConfig = {}

-- ── Gameplay ─────────────────────────────────────────
NukeConfig.COOLDOWN_SECONDS     = 600   -- 10 minutes between nukes
NukeConfig.NUKE_COST            = 5000  -- In-game currency cost
NukeConfig.MAX_ACTIVE_NUKES     = 1     -- Only 1 nuke at a time
NukeConfig.MISSILE_SPAWN_HEIGHT = 2000  -- Studs above target
NukeConfig.MISSILE_TRAVEL_TIME  = 12    -- Seconds from spawn to impact
NukeConfig.WARNING_DURATION     = 15    -- Seconds of siren before impact

-- ── Blast Zones ──────────────────────────────────────
NukeConfig.ZONES = {
  { maxRadius = 100,  damage = math.huge, label = "Lethal"   }, -- instant kill
  { maxRadius = 250,  damage = 75,        label = "Severe"   },
  { maxRadius = 400,  damage = 40,        label = "Moderate" },
  -- Beyond 400: safe
}

-- ── Visual ───────────────────────────────────────────
NukeConfig.SCORCH_RADIUS        = 180   -- Ground scorch decal radius
NukeConfig.SHOCKWAVE_MAX_RADIUS = 450   -- Shockwave ring max size
NukeConfig.SHOCKWAVE_DURATION   = 3     -- Seconds to expand
NukeConfig.MUSHROOM_HEIGHT      = 400   -- Mushroom cloud peak height
NukeConfig.FLASH_DURATION       = 0.8   -- White flash seconds
NukeConfig.CAMERA_SHAKE_DIST    = 500   -- Studs — camera shake falloff

-- ── Audio IDs (replace with your asset IDs) ──────────
NukeConfig.SOUND_LAUNCH         = "rbxassetid://1369158361"
NukeConfig.SOUND_TRAVEL         = "rbxassetid://2845766501"
NukeConfig.SOUND_SIREN          = "rbxassetid://130766067"
NukeConfig.SOUND_EXPLOSION      = "rbxassetid://3375826698"
NukeConfig.SOUND_SHOCKWAVE      = "rbxassetid://2691586720"

-- ── Admin ─────────────────────────────────────────────
NukeConfig.ADMIN_IDS = {
  123456789,  -- Replace with real UserId
  987654321,
}

NukeConfig.ADMIN_COMMAND = "!nuke"     -- Chat command

-- ── Performance ──────────────────────────────────────
NukeConfig.LOW_QUALITY_PARTICLE_RATE = 0.3 -- Multiplier for low-end devices
NukeConfig.DEBRIS_DESTROY_RADIUS     = 300 -- Stud radius for prop destruction

return NukeConfig`,
  },
  {
    id: 'security',
    label: 'NukeSecurity.lua',
    type: 'ModuleScript',
    path: 'ReplicatedStorage/NukeSystem/Modules/',
    desc: 'Anti-exploit validation — all checks run server-side',
    color: 'text-yellow-400',
    badge: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-400',
    code: `-- NukeSecurity.lua (ModuleScript)
-- ReplicatedStorage > NukeSystem > Modules > NukeSecurity
-- =====================================================

local NukeSecurity = {}
local Config = require(script.Parent.NukeConfig)

-- Track per-player cooldowns and last request times
local playerCooldowns  = {}  -- [UserId] = tick()
local lastRequestTimes = {}  -- Rate-limiting
local activeNukeCount  = 0

-- ── Setters (called by NukeHandler) ──────────────────
function NukeSecurity.SetActiveNukes(count)
  activeNukeCount = count
end

function NukeSecurity.SetCooldown(player)
  playerCooldowns[player.UserId] = tick()
end

function NukeSecurity.ClearCooldown(player)
  playerCooldowns[player.UserId] = nil
end

-- ── Validation ───────────────────────────────────────
function NukeSecurity.CanLaunch(player, targetPos)
  -- 1. Rate limit: prevent spam (max 1 request per 5 seconds)
  local now = tick()
  local lastReq = lastRequestTimes[player.UserId] or 0
  if now - lastReq < 5 then
    warn("[NukeSecurity] Rate limit hit for:", player.Name)
    return false, "Too many requests"
  end
  lastRequestTimes[player.UserId] = now

  -- 2. One active nuke at a time
  if activeNukeCount >= Config.MAX_ACTIVE_NUKES then
    return false, "A nuke is already active"
  end

  -- 3. Cooldown check
  local lastLaunch = playerCooldowns[player.UserId] or 0
  if now - lastLaunch < Config.COOLDOWN_SECONDS then
    local remaining = math.ceil(Config.COOLDOWN_SECONDS - (now - lastLaunch))
    return false, ("Cooldown: %d seconds remaining"):format(remaining)
  end

  -- 4. Target position sanity check (must be a valid Vector3 on the map)
  if typeof(targetPos) ~= "Vector3" then
    warn("[NukeSecurity] Invalid targetPos type from:", player.Name)
    return false, "Invalid target"
  end

  -- 5. Validate target is within map bounds (adjust to your map size)
  local MAP_BOUNDS = 5000
  if math.abs(targetPos.X) > MAP_BOUNDS or math.abs(targetPos.Z) > MAP_BOUNDS then
    warn("[NukeSecurity] Out-of-bounds target from:", player.Name)
    return false, "Target out of bounds"
  end

  -- 6. Currency check (connect to your DataStore / currency module)
  local currency = NukeSecurity.GetCurrency(player)
  if currency < Config.NUKE_COST then
    return false, ("Need %d currency (have %d)"):format(Config.NUKE_COST, currency)
  end

  return true, "OK"
end

-- ── Admin check ───────────────────────────────────────
function NukeSecurity.IsAdmin(player)
  for _, id in ipairs(Config.ADMIN_IDS) do
    if player.UserId == id then return true end
  end
  return false
end

-- ── Currency stub (replace with your DataStore module) ─
function NukeSecurity.GetCurrency(player)
  -- TODO: Replace with actual currency retrieval
  -- e.g. return DataManager.GetCoins(player)
  local leaderstats = player:FindFirstChild("leaderstats")
  if leaderstats then
    local coins = leaderstats:FindFirstChild("Coins")
    if coins then return coins.Value end
  end
  return 0
end

function NukeSecurity.DeductCurrency(player, amount)
  -- TODO: Replace with actual deduction
  local leaderstats = player:FindFirstChild("leaderstats")
  if leaderstats then
    local coins = leaderstats:FindFirstChild("Coins")
    if coins then coins.Value = coins.Value - amount end
  end
end

return NukeSecurity`,
  },
  {
    id: 'server',
    label: 'NukeHandler.server.lua',
    type: 'Script',
    path: 'ServerScriptService/',
    desc: 'Core server logic — missile spawning, damage calculation, event broadcasting',
    color: 'text-green-400',
    badge: 'bg-green-400/10 border-green-400/30 text-green-400',
    code: `-- NukeHandler.server.lua (Script)
-- ServerScriptService
-- =====================================================
-- SERVER ONLY — never trust the client

local RunService      = game:GetService("RunService")
local Players         = game:GetService("Players")
local TweenService    = game:GetService("TweenService")
local Debris          = game:GetService("Debris")

local RS              = game:GetService("ReplicatedStorage")
local NukeSystem      = RS:WaitForChild("NukeSystem")
local Remotes         = NukeSystem:WaitForChild("RemoteEvents")
local Modules         = NukeSystem:WaitForChild("Modules")

local Config          = require(Modules:WaitForChild("NukeConfig"))
local Security        = require(Modules:WaitForChild("NukeSecurity"))

-- RemoteEvents
local LaunchNuke      = Remotes:WaitForChild("LaunchNuke")
local NukeWarning     = Remotes:WaitForChild("NukeWarning")
local NukeImpact      = Remotes:WaitForChild("NukeImpact")
local NukeDamage      = Remotes:WaitForChild("NukeDamage")
local NukeStatus      = Remotes:WaitForChild("NukeStatus")
local CancelNuke      = Remotes:WaitForChild("CancelNuke")

local activeNuke      = nil  -- Only one nuke at a time
local nukeCancelled   = false

-- ── Helper: Play sound on all clients ────────────────
local function BroadcastSound(soundId, position)
  NukeWarning:FireAllClients("SOUND", soundId, position)
end

-- ── Helper: Get all players in radius ────────────────
local function GetPlayersInRadius(center, radius)
  local result = {}
  for _, plr in ipairs(Players:GetPlayers()) do
    local char = plr.Character
    if char then
      local hrp = char:FindFirstChild("HumanoidRootPart")
      if hrp then
        local dist = (hrp.Position - center).Magnitude
        if dist <= radius then
          table.insert(result, { player = plr, distance = dist })
        end
      end
    end
  end
  return result
end

-- ── Helper: Apply damage by zone ─────────────────────
local function ApplyBlastDamage(impactPos)
  local maxRadius = Config.ZONES[#Config.ZONES].maxRadius

  for _, data in ipairs(GetPlayersInRadius(impactPos, maxRadius)) do
    local plr  = data.player
    local dist = data.distance

    local damage = 0
    for _, zone in ipairs(Config.ZONES) do
      if dist <= zone.maxRadius then
        damage = zone.damage
        break
      end
    end

    if damage > 0 then
      local char = plr.Character
      if char then
        local hum = char:FindFirstChildOfClass("Humanoid")
        if hum then
          if damage == math.huge then
            hum.Health = 0  -- Instant kill
          else
            hum:TakeDamage(damage)
          end
          -- Notify client for death screen / effect
          NukeDamage:FireClient(plr, damage, dist)
        end
      end
    end
  end
end

-- ── Helper: Destroy buildings in radius ──────────────
local function DestroyDebris(impactPos)
  local workspace = game:GetService("Workspace")
  for _, obj in ipairs(workspace:GetDescendants()) do
    if obj:IsA("BasePart") and obj:FindFirstAncestorOfClass("Model") then
      local model = obj:FindFirstAncestorOfClass("Model")
      -- Tag destructible models with a "Destructible" attribute in Studio
      if model and model:GetAttribute("Destructible") then
        local dist = (obj.Position - impactPos).Magnitude
        if dist <= Config.DEBRIS_DESTROY_RADIUS then
          -- Staggered destruction for performance
          local delay = (dist / Config.DEBRIS_DESTROY_RADIUS) * 2
          task.delay(delay, function()
            if model and model.Parent then
              model:Destroy()
            end
          end)
        end
      end
    end
  end
end

-- ── Helper: Spawn scorch mark ────────────────────────
local function SpawnScorchMark(impactPos)
  local scorch = Instance.new("Part")
  scorch.Name       = "NukeScorch"
  scorch.Size       = Vector3.new(Config.SCORCH_RADIUS * 2, 0.1, Config.SCORCH_RADIUS * 2)
  scorch.Position   = Vector3.new(impactPos.X, 0.1, impactPos.Z)
  scorch.Anchored   = true
  scorch.CanCollide = false
  scorch.Material   = Enum.Material.SmoothPlastic
  scorch.Color      = Color3.fromRGB(20, 15, 10)
  scorch.Shape      = Enum.PartType.Cylinder
  scorch.Parent     = game.Workspace

  local decal = Instance.new("Decal")
  decal.Texture  = "rbxassetid://168143648"  -- Scorch texture
  decal.Face     = Enum.NormalId.Top
  decal.Parent   = scorch

  Debris:AddItem(scorch, 300)  -- Clean up after 5 minutes
end

-- ── Main: Launch nuke sequence ───────────────────────
local function ExecuteNuke(targetPos)
  nukeCancelled = false
  activeNuke = true
  Security.SetActiveNukes(1)

  -- 1. Spawn missile far above target
  local spawnPos = Vector3.new(targetPos.X, targetPos.Y + Config.MISSILE_SPAWN_HEIGHT, targetPos.Z)
  local missile  = Instance.new("Part")
  missile.Name      = "NukeMissile"
  missile.Size      = Vector3.new(3, 12, 3)
  missile.Position  = spawnPos
  missile.Anchored  = true
  missile.CanCollide= false
  missile.Color     = Color3.fromRGB(200, 200, 210)
  missile.Material  = Enum.Material.Metal
  missile.CastShadow= false
  missile.Parent    = game.Workspace

  -- Exhaust trail
  local trail = Instance.new("Trail")
  local a0 = Instance.new("Attachment", missile)
  local a1 = Instance.new("Attachment", missile)
  a1.Position = Vector3.new(0, -6, 0)
  trail.Attachment0 = a0
  trail.Attachment1 = a1
  trail.Lifetime    = 3
  trail.Color       = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(255,140,50)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(120,120,120)),
  })
  trail.WidthScale  = NumberSequence.new(2)
  trail.Parent      = missile

  -- 2. Broadcast warning to all clients
  local warningData = {
    targetPos  = targetPos,
    countdown  = Config.WARNING_DURATION,
    missilePos = spawnPos,
  }
  NukeWarning:FireAllClients("WARNING", warningData)

  -- 3. Tween missile to target
  local tween = TweenService:Create(
    missile,
    TweenInfo.new(Config.MISSILE_TRAVEL_TIME, Enum.EasingStyle.Linear),
    { Position = targetPos }
  )
  tween:Play()

  -- Wait for impact (or cancellation)
  local elapsed = 0
  local TICK = 0.1
  while elapsed < Config.MISSILE_TRAVEL_TIME do
    task.wait(TICK)
    elapsed = elapsed + TICK
    if nukeCancelled then
      tween:Cancel()
      missile:Destroy()
      activeNuke = nil
      Security.SetActiveNukes(0)
      NukeWarning:FireAllClients("CANCEL", {})
      return
    end
  end

  -- 4. IMPACT
  missile:Destroy()

  -- Notify all clients: trigger VFX
  NukeImpact:FireAllClients({
    position       = targetPos,
    shockwaveRadius= Config.SHOCKWAVE_MAX_RADIUS,
    shakeDist      = Config.CAMERA_SHAKE_DIST,
  })

  -- 5. Apply damage (server-side)
  ApplyBlastDamage(targetPos)

  -- 6. Destroy buildings
  DestroyDebris(targetPos)

  -- 7. Scorch mark
  SpawnScorchMark(targetPos)

  -- 8. Cleanup
  task.wait(1)
  activeNuke = nil
  Security.SetActiveNukes(0)
end

-- ── RemoteEvent: LaunchNuke ───────────────────────────
LaunchNuke.OnServerEvent:Connect(function(player, targetPos)
  -- Security validation
  local ok, reason = Security.CanLaunch(player, targetPos)
  if not ok then
    NukeStatus:FireClient(player, { success = false, reason = reason })
    return
  end

  -- Deduct currency
  Security.DeductCurrency(player, Config.NUKE_COST)

  -- Set cooldown
  Security.SetCooldown(player)

  -- Confirm to launcher
  NukeStatus:FireClient(player, { success = true })

  -- Execute in background task
  task.spawn(ExecuteNuke, targetPos)
end)

-- ── RemoteEvent: Admin Cancel ─────────────────────────
CancelNuke.OnServerEvent:Connect(function(player)
  if not Security.IsAdmin(player) then
    warn("[NukeSecurity] Unauthorized cancel attempt by:", player.Name)
    return
  end
  if activeNuke then
    nukeCancelled = true
  end
end)

-- ── Chat command: Admin nuke ──────────────────────────
Players.PlayerAdded:Connect(function(player)
  player.Chatted:Connect(function(msg)
    if not Security.IsAdmin(player) then return end

    local cmd, x, z = msg:match("^" .. Config.ADMIN_COMMAND .. "%s+(-?%d+)%s+(-?%d+)$")
    if cmd or (x and z) then
      local targetPos = Vector3.new(tonumber(x) or 0, 0, tonumber(z) or 0)
      task.spawn(ExecuteNuke, targetPos)
    end
  end)
end)

print("[NukeHandler] Nuclear Strike System loaded ✓")`,
  },
  {
    id: 'client',
    label: 'NukeClient.client.lua',
    type: 'LocalScript',
    path: 'StarterPlayerScripts/',
    desc: 'Client-side VFX — mushroom cloud, shockwave, flash, camera shake',
    color: 'text-blue-400',
    badge: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
    code: `-- NukeClient.client.lua (LocalScript)
-- StarterPlayerScripts
-- =====================================================
-- Handles all visual + audio effects on the client

local Players         = game:GetService("Players")
local TweenService    = game:GetService("TweenService")
local RunService      = game:GetService("RunService")
local SoundService    = game:GetService("SoundService")
local Debris          = game:GetService("Debris")

local LocalPlayer     = Players.LocalPlayer
local Camera          = workspace.CurrentCamera

local RS              = game:GetService("ReplicatedStorage")
local NukeSystem      = RS:WaitForChild("NukeSystem")
local Remotes         = NukeSystem:WaitForChild("RemoteEvents")
local Modules         = NukeSystem:WaitForChild("Modules")

local Config          = require(Modules:WaitForChild("NukeConfig"))
local NukeWarning     = Remotes:WaitForChild("NukeWarning")
local NukeImpact      = Remotes:WaitForChild("NukeImpact")

-- Active sounds (so we can stop them)
local sirenSound      = nil
local travelSound     = nil

-- ── Camera Shake ─────────────────────────────────────
local shakeOffset = CFrame.new()
local shaking     = false

RunService.RenderStepped:Connect(function()
  if shaking then
    Camera.CFrame = Camera.CFrame * shakeOffset
  end
end)

local function StartCameraShake(intensity, duration)
  shaking   = true
  local endTime = tick() + duration

  task.spawn(function()
    while tick() < endTime do
      local r = intensity * (1 - ((tick() - (endTime - duration)) / duration))
      shakeOffset = CFrame.Angles(
        math.rad(math.random(-r * 10, r * 10) * 0.1),
        math.rad(math.random(-r * 10, r * 10) * 0.1),
        math.rad(math.random(-r * 5, r * 5) * 0.1)
      )
      task.wait(0.03)
    end
    shaking     = false
    shakeOffset = CFrame.new()
  end)
end

-- ── Nuclear Flash ─────────────────────────────────────
local function DoNuclearFlash()
  local gui = LocalPlayer.PlayerGui:FindFirstChild("NukeFlash")
  if not gui then return end
  local frame = gui:FindFirstChild("FlashFrame")
  if not frame then return end

  frame.BackgroundTransparency = 0  -- White flash on

  TweenService:Create(
    frame,
    TweenInfo.new(Config.FLASH_DURATION, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
    { BackgroundTransparency = 1 }
  ):Play()
end

-- ── Mushroom Cloud ────────────────────────────────────
local function SpawnMushroomCloud(pos)
  local cloud = Instance.new("Model")
  cloud.Name  = "MushroomCloud"

  -- Stem
  local stem = Instance.new("Part")
  stem.Name      = "Stem"
  stem.Size      = Vector3.new(30, Config.MUSHROOM_HEIGHT * 0.6, 30)
  stem.Position  = Vector3.new(pos.X, pos.Y + (Config.MUSHROOM_HEIGHT * 0.3), pos.Z)
  stem.Anchored  = true
  stem.CanCollide= false
  stem.Material  = Enum.Material.SmoothPlastic
  stem.Color     = Color3.fromRGB(80, 60, 50)
  stem.CastShadow= false
  stem.Parent    = cloud

  -- Smoke particles on stem
  local smokeEmitter = Instance.new("ParticleEmitter")
  smokeEmitter.Texture         = "rbxassetid://3166619987"
  smokeEmitter.Color           = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 100, 20)),
    ColorSequenceKeypoint.new(0.5, Color3.fromRGB(80, 70, 60)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(50, 50, 50)),
  })
  smokeEmitter.LightEmission   = 0.5
  smokeEmitter.Size            = NumberSequence.new({ NumberSequenceKeypoint.new(0, 5), NumberSequenceKeypoint.new(1, 40) })
  smokeEmitter.Transparency    = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0), NumberSequenceKeypoint.new(1, 1) })
  smokeEmitter.Rate            = 60
  smokeEmitter.Lifetime        = NumberRange.new(4, 8)
  smokeEmitter.Speed           = NumberRange.new(30, 60)
  smokeEmitter.SpreadAngle     = Vector2.new(20, 20)
  smokeEmitter.RotSpeed        = NumberRange.new(-45, 45)
  smokeEmitter.Rotation        = NumberRange.new(0, 360)
  smokeEmitter.Parent          = stem

  -- Fire on stem base
  local fire = Instance.new("Fire")
  fire.Size   = 30
  fire.Heat   = 25
  fire.Color  = Color3.fromRGB(255, 120, 0)
  fire.SecondaryColor = Color3.fromRGB(255, 50, 0)
  fire.Parent = stem

  -- Cap
  local cap = Instance.new("Part")
  cap.Name      = "Cap"
  cap.Shape     = Enum.PartType.Ball
  cap.Size      = Vector3.new(160, 100, 160)
  cap.Position  = Vector3.new(pos.X, pos.Y + Config.MUSHROOM_HEIGHT * 0.75, pos.Z)
  cap.Anchored  = true
  cap.CanCollide= false
  cap.Material  = Enum.Material.SmoothPlastic
  cap.Color     = Color3.fromRGB(60, 50, 40)
  cap.CastShadow= false
  cap.Parent    = cloud

  local capSmoke = smokeEmitter:Clone()
  capSmoke.Rate   = 120
  capSmoke.Parent = cap

  cloud.Parent = game.Workspace

  -- Tween stem grow upward
  stem.Size     = Vector3.new(30, 0, 30)
  stem.Position = Vector3.new(pos.X, pos.Y, pos.Z)

  TweenService:Create(stem, TweenInfo.new(3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
    Size     = Vector3.new(30, Config.MUSHROOM_HEIGHT * 0.6, 30),
    Position = Vector3.new(pos.X, pos.Y + Config.MUSHROOM_HEIGHT * 0.3, pos.Z),
  }):Play()

  -- Auto clean after 120 seconds
  Debris:AddItem(cloud, 120)
end

-- ── Shockwave Ring ────────────────────────────────────
local function SpawnShockwave(pos)
  local ring = Instance.new("Part")
  ring.Name      = "NukeShockwave"
  ring.Size      = Vector3.new(10, 5, 10)
  ring.Position  = Vector3.new(pos.X, pos.Y + 5, pos.Z)
  ring.Anchored  = true
  ring.CanCollide= false
  ring.Transparency = 0.3
  ring.Material  = Enum.Material.Neon
  ring.Color     = Color3.fromRGB(255, 140, 50)
  ring.Shape     = Enum.PartType.Cylinder
  ring.CastShadow= false
  ring.Parent    = game.Workspace

  -- Heat distortion smoke
  local smoke = Instance.new("ParticleEmitter")
  smoke.Texture       = "rbxassetid://3166619987"
  smoke.Color         = ColorSequence.new(Color3.fromRGB(200, 160, 100))
  smoke.LightEmission = 0.8
  smoke.Size          = NumberSequence.new(8)
  smoke.Rate          = 200
  smoke.Lifetime      = NumberRange.new(0.5, 1.5)
  smoke.Speed         = NumberRange.new(50, 150)
  smoke.SpreadAngle   = Vector2.new(90, 90)
  smoke.Parent        = ring

  TweenService:Create(ring, TweenInfo.new(Config.SHOCKWAVE_DURATION, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
    Size          = Vector3.new(Config.SHOCKWAVE_MAX_RADIUS * 2, 5, Config.SHOCKWAVE_MAX_RADIUS * 2),
    Transparency  = 1,
    Position      = Vector3.new(pos.X, pos.Y + 2, pos.Z),
  }):Play()

  Debris:AddItem(ring, Config.SHOCKWAVE_DURATION + 1)
end

-- ── Audio helpers ─────────────────────────────────────
local function PlaySound(soundId, position, volume, looped)
  local part = Instance.new("Part")
  part.Size      = Vector3.new(1, 1, 1)
  part.Position  = position or Vector3.new(0, 0, 0)
  part.Anchored  = true
  part.CanCollide= false
  part.Transparency = 1
  part.Parent    = game.Workspace

  local sound = Instance.new("Sound")
  sound.SoundId   = soundId
  sound.Volume    = volume or 1
  sound.Looped    = looped or false
  sound.RollOffMaxDistance = 3000
  sound.Parent    = part

  sound:Play()

  if not looped then
    Debris:AddItem(part, sound.TimeLength + 2)
  end

  return sound, part
end

-- ── Event: Warning (siren + countdown trigger) ────────
NukeWarning.OnClientEvent:Connect(function(eventType, data)
  if eventType == "WARNING" then
    -- Trigger UI (handled by NukeUI.client.lua)
    -- Play global siren
    sirenSound = Instance.new("Sound")
    sirenSound.SoundId    = Config.SOUND_SIREN
    sirenSound.Volume     = 0.8
    sirenSound.Looped     = true
    sirenSound.Parent     = SoundService
    sirenSound:Play()

    -- Play travel sound near target
    travelSound = PlaySound(Config.SOUND_TRAVEL, data.targetPos, 0.6, true)

  elseif eventType == "CANCEL" then
    if sirenSound then sirenSound:Stop(); sirenSound:Destroy() end
    if travelSound then travelSound[1]:Stop(); travelSound[2]:Destroy() end

  elseif eventType == "SOUND" then
    -- Generic sound broadcast
    PlaySound(data, Vector3.new(0, 0, 0), 0.5, false)
  end
end)

-- ── Event: Impact ─────────────────────────────────────
NukeImpact.OnClientEvent:Connect(function(data)
  local pos = data.position

  -- Stop siren
  if sirenSound then sirenSound:Stop(); sirenSound:Destroy(); sirenSound = nil end
  if travelSound then travelSound[1]:Stop(); travelSound[2]:Destroy(); travelSound = nil end

  -- Camera shake (intensity based on distance)
  local char = LocalPlayer.Character
  local hrp  = char and char:FindFirstChild("HumanoidRootPart")
  if hrp then
    local dist = (hrp.Position - pos).Magnitude
    if dist <= data.shakeDist then
      local intensity = 1 - (dist / data.shakeDist)
      StartCameraShake(intensity * 5, 4)
    end
  end

  -- Flash
  DoNuclearFlash()

  -- Explosion sound
  PlaySound(Config.SOUND_EXPLOSION, pos, 1.0, false)

  -- Shockwave rumble (delayed)
  task.delay(0.5, function()
    PlaySound(Config.SOUND_SHOCKWAVE, pos, 0.8, false)
  end)

  -- Mushroom cloud
  task.delay(0.3, function()
    SpawnMushroomCloud(pos)
  end)

  -- Shockwave ring
  task.delay(0.2, function()
    SpawnShockwave(pos)
  end)
end)

print("[NukeClient] Effects system ready ✓")`,
  },
  {
    id: 'ui',
    label: 'NukeUI.client.lua',
    type: 'LocalScript',
    path: 'StarterPlayerScripts/',
    desc: 'Countdown timer, warning banner, blast radius indicator, cooldown HUD',
    color: 'text-blue-400',
    badge: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
    code: `-- NukeUI.client.lua (LocalScript)
-- StarterPlayerScripts
-- =====================================================

local Players         = game:GetService("Players")
local TweenService    = game:GetService("TweenService")
local RunService      = game:GetService("RunService")

local LocalPlayer     = Players.LocalPlayer
local PlayerGui       = LocalPlayer:WaitForChild("PlayerGui")

local RS              = game:GetService("ReplicatedStorage")
local NukeSystem      = RS:WaitForChild("NukeSystem")
local Remotes         = NukeSystem:WaitForChild("RemoteEvents")

local NukeWarning     = Remotes:WaitForChild("NukeWarning")
local NukeImpact      = Remotes:WaitForChild("NukeImpact")
local NukeDamage      = Remotes:WaitForChild("NukeDamage")
local NukeStatus      = Remotes:WaitForChild("NukeStatus")

-- ── Build UI ──────────────────────────────────────────
local function BuildUI()
  -- Root ScreenGui
  local screenGui = Instance.new("ScreenGui")
  screenGui.Name            = "NukeUI"
  screenGui.ResetOnSpawn    = false
  screenGui.DisplayOrder    = 100
  screenGui.ZIndexBehavior  = Enum.ZIndexBehavior.Sibling
  screenGui.Parent          = PlayerGui

  -- ── Warning Banner ──
  local banner = Instance.new("Frame")
  banner.Name              = "WarningBanner"
  banner.Size              = UDim2.new(1, 0, 0, 70)
  banner.Position          = UDim2.new(0, 0, 0, -70)  -- hidden above screen
  banner.BackgroundColor3  = Color3.fromRGB(180, 0, 0)
  banner.BorderSizePixel   = 0
  banner.ZIndex            = 10
  banner.Parent            = screenGui

  local bannerLabel = Instance.new("TextLabel")
  bannerLabel.Name             = "Label"
  bannerLabel.Size             = UDim2.new(1, 0, 1, 0)
  bannerLabel.BackgroundTransparency = 1
  bannerLabel.Text             = "☢ NUCLEAR STRIKE INBOUND ☢"
  bannerLabel.TextColor3       = Color3.fromRGB(255, 255, 255)
  bannerLabel.TextSize         = 28
  bannerLabel.Font             = Enum.Font.GothamBold
  bannerLabel.ZIndex           = 11
  bannerLabel.Parent           = banner

  -- ── Countdown Frame ──
  local countdownFrame = Instance.new("Frame")
  countdownFrame.Name             = "CountdownFrame"
  countdownFrame.Size             = UDim2.new(0, 220, 0, 100)
  countdownFrame.AnchorPoint      = Vector2.new(0.5, 0)
  countdownFrame.Position         = UDim2.new(0.5, 0, 0, 80)
  countdownFrame.BackgroundColor3 = Color3.fromRGB(10, 0, 0)
  countdownFrame.BackgroundTransparency = 0.3
  countdownFrame.BorderSizePixel  = 0
  countdownFrame.Visible          = false
  countdownFrame.ZIndex           = 10
  countdownFrame.Parent           = screenGui

  Instance.new("UICorner", countdownFrame).CornerRadius = UDim.new(0, 12)

  local countdownLabel = Instance.new("TextLabel")
  countdownLabel.Name             = "Timer"
  countdownLabel.Size             = UDim2.new(1, 0, 0.6, 0)
  countdownLabel.Position         = UDim2.new(0, 0, 0.1, 0)
  countdownLabel.BackgroundTransparency = 1
  countdownLabel.Text             = "00"
  countdownLabel.TextColor3       = Color3.fromRGB(255, 60, 60)
  countdownLabel.TextSize         = 52
  countdownLabel.Font             = Enum.Font.GothamBold
  countdownLabel.ZIndex           = 11
  countdownLabel.Parent           = countdownFrame

  local countdownSub = Instance.new("TextLabel")
  countdownSub.Size               = UDim2.new(1, 0, 0.3, 0)
  countdownSub.Position           = UDim2.new(0, 0, 0.7, 0)
  countdownSub.BackgroundTransparency = 1
  countdownSub.Text               = "SECONDS TO IMPACT"
  countdownSub.TextColor3         = Color3.fromRGB(200, 100, 100)
  countdownSub.TextSize           = 11
  countdownSub.Font               = Enum.Font.GothamBold
  countdownSub.ZIndex             = 11
  countdownSub.Parent             = countdownFrame

  -- ── Flash overlay ──
  local flashGui = Instance.new("ScreenGui")
  flashGui.Name           = "NukeFlash"
  flashGui.DisplayOrder   = 200
  flashGui.ResetOnSpawn   = false
  flashGui.Parent         = PlayerGui

  local flashFrame = Instance.new("Frame")
  flashFrame.Name                    = "FlashFrame"
  flashFrame.Size                    = UDim2.new(1, 0, 1, 0)
  flashFrame.BackgroundColor3        = Color3.fromRGB(255, 255, 255)
  flashFrame.BackgroundTransparency  = 1
  flashFrame.BorderSizePixel         = 0
  flashFrame.ZIndex                  = 200
  flashFrame.Parent                  = flashGui

  -- ── Cooldown HUD (bottom left) ──
  local cooldownFrame = Instance.new("Frame")
  cooldownFrame.Name              = "CooldownHUD"
  cooldownFrame.Size              = UDim2.new(0, 200, 0, 40)
  cooldownFrame.Position          = UDim2.new(0, 16, 1, -56)
  cooldownFrame.BackgroundColor3  = Color3.fromRGB(10, 10, 15)
  cooldownFrame.BackgroundTransparency = 0.4
  cooldownFrame.BorderSizePixel   = 0
  cooldownFrame.Visible           = false
  cooldownFrame.ZIndex            = 5
  cooldownFrame.Parent            = screenGui

  Instance.new("UICorner", cooldownFrame).CornerRadius = UDim.new(0, 8)

  local cdLabel = Instance.new("TextLabel")
  cdLabel.Name                 = "CDLabel"
  cdLabel.Size                 = UDim2.new(1, -10, 1, 0)
  cdLabel.Position             = UDim2.new(0, 10, 0, 0)
  cdLabel.BackgroundTransparency = 1
  cdLabel.Text                 = "☢ Nuke Ready"
  cdLabel.TextColor3           = Color3.fromRGB(255, 200, 50)
  cdLabel.TextSize             = 14
  cdLabel.TextXAlignment       = Enum.TextXAlignment.Left
  cdLabel.Font                 = Enum.Font.GothamBold
  cdLabel.ZIndex               = 6
  cdLabel.Parent               = cooldownFrame

  return {
    banner        = banner,
    bannerLabel   = bannerLabel,
    countdown     = countdownFrame,
    timer         = countdownLabel,
    cooldownFrame = cooldownFrame,
    cdLabel       = cdLabel,
  }
end

local UI = BuildUI()

-- ── Warning: Show banner + start countdown ────────────
NukeWarning.OnClientEvent:Connect(function(eventType, data)
  if eventType == "WARNING" then
    -- Slide banner in
    TweenService:Create(UI.banner, TweenInfo.new(0.4, Enum.EasingStyle.Back), {
      Position = UDim2.new(0, 0, 0, 0)
    }):Play()

    -- Blink banner
    task.spawn(function()
      for i = 1, 20 do
        task.wait(0.4)
        UI.banner.BackgroundColor3 = (i % 2 == 0)
          and Color3.fromRGB(180, 0, 0)
          or  Color3.fromRGB(255, 50, 50)
      end
    end)

    -- Countdown
    UI.countdown.Visible = true
    local remaining = data.countdown
    task.spawn(function()
      while remaining > 0 do
        UI.timer.Text = tostring(remaining)
        -- Pulse red when < 5 seconds
        if remaining <= 5 then
          TweenService:Create(UI.timer, TweenInfo.new(0.2), {
            TextColor3 = Color3.fromRGB(255, 0, 0)
          }):Play()
        end
        task.wait(1)
        remaining = remaining - 1
      end
      UI.timer.Text = "💥"
    end)

  elseif eventType == "CANCEL" then
    -- Slide banner out
    TweenService:Create(UI.banner, TweenInfo.new(0.3), {
      Position = UDim2.new(0, 0, 0, -70)
    }):Play()
    UI.countdown.Visible = false
  end
end)

-- ── Impact: Hide warning UI ───────────────────────────
NukeImpact.OnClientEvent:Connect(function()
  task.wait(2)
  TweenService:Create(UI.banner, TweenInfo.new(0.5), {
    Position = UDim2.new(0, 0, 0, -70)
  }):Play()
  task.wait(0.6)
  UI.countdown.Visible = false
end)

-- ── Cooldown HUD ─────────────────────────────────────
NukeStatus.OnClientEvent:Connect(function(data)
  if not data.success then
    -- Show error briefly
    UI.cooldownFrame.Visible = true
    UI.cdLabel.Text          = "✗ " .. (data.reason or "Cannot launch")
    UI.cdLabel.TextColor3    = Color3.fromRGB(255, 80, 80)
    task.delay(3, function()
      UI.cooldownFrame.Visible = false
    end)
    return
  end

  -- Show cooldown timer
  UI.cooldownFrame.Visible  = true
  local Config = require(game.ReplicatedStorage.NukeSystem.Modules.NukeConfig)
  local endTime = tick() + Config.COOLDOWN_SECONDS

  task.spawn(function()
    while tick() < endTime do
      local rem = math.ceil(endTime - tick())
      local mins = math.floor(rem / 60)
      local secs = rem % 60
      UI.cdLabel.Text       = ("☢ Cooldown: %d:%02d"):format(mins, secs)
      UI.cdLabel.TextColor3 = Color3.fromRGB(200, 150, 50)
      task.wait(1)
    end
    UI.cdLabel.Text       = "☢ Nuke Ready"
    UI.cdLabel.TextColor3 = Color3.fromRGB(100, 255, 100)
    task.delay(3, function()
      UI.cooldownFrame.Visible = false
    end)
  end)
end)

print("[NukeUI] UI system ready ✓")`,
  },
  {
    id: 'device',
    label: 'LaunchDevice.client.lua',
    type: 'LocalScript',
    path: 'StarterPlayerScripts/',
    desc: 'Launch Device tool — click to target, radius preview, fire RemoteEvent',
    color: 'text-blue-400',
    badge: 'bg-blue-400/10 border-blue-400/30 text-blue-400',
    code: `-- LaunchDevice.client.lua (LocalScript)
-- StarterPlayerScripts
-- =====================================================
-- Handles the Nuke Launch Device tool

local Players          = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService       = game:GetService("RunService")

local LocalPlayer      = Players.LocalPlayer
local Mouse            = LocalPlayer:GetMouse()
local Camera           = workspace.CurrentCamera

local RS               = game:GetService("ReplicatedStorage")
local NukeSystem       = RS:WaitForChild("NukeSystem")
local Remotes          = NukeSystem:WaitForChild("RemoteEvents")
local Modules          = NukeSystem:WaitForChild("Modules")

local Config           = require(Modules:WaitForChild("NukeConfig"))
local LaunchNuke       = Remotes:WaitForChild("LaunchNuke")
local NukeStatus       = Remotes:WaitForChild("NukeStatus")

-- ── Blast Radius Preview Circle ────────────────────────
local radiusIndicator  = nil
local isDeviceEquipped = false

local function CreateRadiusIndicator()
  local part = Instance.new("Part")
  part.Name             = "BlastRadiusIndicator"
  part.Size             = Vector3.new(Config.ZONES[#Config.ZONES].maxRadius * 2, 0.1, Config.ZONES[#Config.ZONES].maxRadius * 2)
  part.Anchored         = true
  part.CanCollide       = false
  part.CanTouch         = false
  part.CastShadow       = false
  part.Transparency     = 0.6
  part.Color            = Color3.fromRGB(255, 50, 0)
  part.Material         = Enum.Material.Neon
  part.Shape            = Enum.PartType.Cylinder
  part.Parent           = game.Workspace

  -- Zone rings
  for i, zone in ipairs(Config.ZONES) do
    local ring = Instance.new("SelectionSphere")
    ring.SurfaceColor3    = Color3.fromHSV(i / #Config.ZONES * 0.15, 1, 1)
    ring.Color3           = Color3.fromHSV(i / #Config.ZONES * 0.15, 1, 1)
    ring.SurfaceTransparency = 0.7
    ring.Adornee          = part
    ring.Radius           = zone.maxRadius
    ring.Parent           = part
  end

  local highlight = Instance.new("SelectionBox")
  highlight.Color3         = Color3.fromRGB(255, 0, 0)
  highlight.LineThickness  = 0
  highlight.SurfaceColor3  = Color3.fromRGB(255, 50, 0)
  highlight.SurfaceTransparency = 0.85
  highlight.Adornee        = part
  highlight.Parent         = part

  return part
end

-- Update indicator position to follow mouse
RunService.RenderStepped:Connect(function()
  if not isDeviceEquipped or not radiusIndicator then return end

  local ray = Ray.new(Camera.CFrame.Position, (Mouse.Hit.Position - Camera.CFrame.Position).Unit * 2000)
  local hit, pos = game.Workspace:FindPartOnRayWithIgnoreList(ray, {
    radiusIndicator,
    LocalPlayer.Character or Instance.new("Model"),
  })

  if hit then
    radiusIndicator.Position = Vector3.new(pos.X, 0.1, pos.Z)
  end
end)

-- ── Device equipped / unequipped ─────────────────────
local character = LocalPlayer.Character or LocalPlayer.CharacterAdded:Wait()

local function onToolEquipped(tool)
  if tool.Name ~= "NukeLaunchDevice" then return end
  isDeviceEquipped  = true
  radiusIndicator   = CreateRadiusIndicator()
  Mouse.Icon        = "rbxasset://textures/GunCursor.png"
end

local function onToolUnequipped(tool)
  if tool.Name ~= "NukeLaunchDevice" then return end
  isDeviceEquipped = false
  if radiusIndicator then
    radiusIndicator:Destroy()
    radiusIndicator = nil
  end
  Mouse.Icon = ""
end

-- Watch for character respawn
local function setupCharacter(char)
  character = char
  local backpack = LocalPlayer:FindFirstChildOfClass("Backpack")
  if backpack then
    for _, tool in ipairs(backpack:GetChildren()) do
      tool.Equipped:Connect(function() onToolEquipped(tool) end)
      tool.Unequipped:Connect(function() onToolUnequipped(tool) end)
    end
  end
end

LocalPlayer.CharacterAdded:Connect(setupCharacter)
setupCharacter(character)

-- ── Click: Launch nuke ────────────────────────────────
UserInputService.InputBegan:Connect(function(input, processed)
  if processed then return end
  if not isDeviceEquipped then return end

  if input.UserInputType == Enum.UserInputType.MouseButton1 then
    local targetPos = Mouse.Hit.Position
    targetPos = Vector3.new(targetPos.X, 0, targetPos.Z) -- Snap to ground

    -- Confirmation dialog (simple version)
    -- TODO: Replace with a proper confirmation UI
    LaunchNuke:FireServer(targetPos)

    -- Remove indicator after launch
    if radiusIndicator then
      radiusIndicator:Destroy()
      radiusIndicator = nil
    end
    isDeviceEquipped = false
  end
end)

print("[LaunchDevice] Launch device ready ✓")`,
  },
];

function CodeBlock({ code, id }: { code: string; id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#8B949E] hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
      >
        {copied ? <><Check size={12} className="text-green-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
      </button>
      <pre className="bg-[#0D1117] border border-[#21262D] rounded-xl p-5 overflow-x-auto text-xs leading-relaxed font-mono text-[#E6EDF3] max-h-[500px] overflow-y-auto scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function NukeScripts() {
  const [active, setActive] = useState('config');
  const current = scripts.find((s) => s.id === active)!;

  return (
    <section className="py-20 px-6 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-red-400 text-xs font-mono tracking-widest uppercase mb-2">Complete Lua Code</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">All Scripts</h2>
          <p className="text-[#64748B]">Production-ready, fully commented — copy straight into Roblox Studio</p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {scripts.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all border ${
                active === s.id
                  ? 'bg-[#1C2128] border-[#30363D] text-white'
                  : 'border-transparent text-[#6B7280] hover:text-[#94A3B8] hover:border-[#21262D]'
              }`}
            >
              <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${s.badge}`}>{s.type}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Active script */}
        <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-[#161B22] border-b border-[#21262D]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div>
                <span className={`text-xs px-2 py-0.5 rounded border font-mono mr-2 ${current.badge}`}>{current.type}</span>
                <span className="text-[#E6EDF3] text-sm font-mono">{current.label}</span>
              </div>
            </div>
            <span className="text-[#484F58] text-xs font-mono hidden md:block">{current.path}{current.label}</span>
          </div>
          <div className="px-5 py-3 bg-[#0D1117] border-b border-[#21262D]">
            <p className="text-[#8B949E] text-sm">{current.desc}</p>
          </div>
          <div className="p-5">
            <CodeBlock code={current.code} id={current.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
