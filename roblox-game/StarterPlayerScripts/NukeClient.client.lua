-- ============================================================
-- NukeClient.client.lua  |  LocalScript
-- Place: StarterPlayerScripts > NukeClient
-- Handles: VFX (mushroom cloud, shockwave, fire, smoke),
--          camera shake, nuclear flash, 3-D audio
-- ============================================================

local Players      = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService   = game:GetService("RunService")
local SoundService = game:GetService("SoundService")
local Debris       = game:GetService("Debris")

local LocalPlayer  = Players.LocalPlayer
local Camera       = workspace.CurrentCamera

local RS           = game:GetService("ReplicatedStorage")
local NukeSystem   = RS:WaitForChild("NukeSystem")
local Remotes      = NukeSystem:WaitForChild("RemoteEvents")
local Config       = require(NukeSystem:WaitForChild("Modules"):WaitForChild("NukeConfig"))

local RE_Warning   = Remotes:WaitForChild("NukeWarning")
local RE_Impact    = Remotes:WaitForChild("NukeImpact")

-- Active looping sounds (so we can stop them)
local sirenSound, travelSoundObj

-- ─────────────────────────────────────────────────────────────
-- Camera Shake
-- ─────────────────────────────────────────────────────────────
local shakeOffset = CFrame.new()
local isShaking   = false

RunService.RenderStepped:Connect(function()
    if isShaking then
        Camera.CFrame = Camera.CFrame * shakeOffset
    end
end)

local function Shake(intensity, duration)
    isShaking = true
    local startT = tick()
    task.spawn(function()
        while tick() - startT < duration do
            local r = intensity * (1 - (tick() - startT) / duration)
            shakeOffset = CFrame.Angles(
                math.rad((math.random() - 0.5) * r * 2),
                math.rad((math.random() - 0.5) * r * 2),
                math.rad((math.random() - 0.5) * r)
            )
            task.wait(0.03)
        end
        isShaking   = false
        shakeOffset = CFrame.new()
    end)
end

-- ─────────────────────────────────────────────────────────────
-- Nuclear Flash
-- ─────────────────────────────────────────────────────────────
local function NuclearFlash(duration)
    local gui = LocalPlayer.PlayerGui:FindFirstChild("NukeFlash")
    if not gui then return end
    local frame = gui:FindFirstChild("FlashFrame")
    if not frame then return end

    frame.BackgroundTransparency = 0
    TweenService:Create(
        frame,
        TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out),
        { BackgroundTransparency = 1 }
    ):Play()
end

-- ─────────────────────────────────────────────────────────────
-- 3-D Positional Sound helper
-- ─────────────────────────────────────────────────────────────
local function Play3DSound(assetId, pos, volume, looped, rolloff)
    local anchor       = Instance.new("Part")
    anchor.Size        = Vector3.new(1, 1, 1)
    anchor.Position    = pos
    anchor.Anchored    = true
    anchor.CanCollide  = false
    anchor.Transparency= 1
    anchor.Parent      = workspace

    local snd                       = Instance.new("Sound")
    snd.SoundId                     = assetId
    snd.Volume                      = volume or 1
    snd.Looped                      = looped or false
    snd.RollOffMaxDistance          = rolloff or 3000
    snd.RollOffMinDistance          = 50
    snd.Parent                      = anchor
    snd:Play()

    if not looped then
        task.delay(snd.TimeLength + 2, function()
            if anchor and anchor.Parent then anchor:Destroy() end
        end)
    end

    return snd, anchor
end

-- ─────────────────────────────────────────────────────────────
-- Mushroom Cloud
-- ─────────────────────────────────────────────────────────────
local function SpawnMushroomCloud(pos, height)
    local cloud = Instance.new("Model")
    cloud.Name  = "MushroomCloud"

    -- ── Stem ─────────────────────────────────────────────────
    local stem          = Instance.new("Part")
    stem.Name           = "Stem"
    stem.Anchored       = true
    stem.CanCollide     = false
    stem.CastShadow     = false
    stem.Size           = Vector3.new(1, 1, 1)   -- tweened below
    stem.Position       = Vector3.new(pos.X, pos.Y, pos.Z)
    stem.Material       = Enum.Material.SmoothPlastic
    stem.Color          = Color3.fromRGB(55, 45, 38)
    stem.Parent         = cloud

    -- Fire at base
    local fire          = Instance.new("Fire")
    fire.Size           = 40
    fire.Heat           = 30
    fire.Color          = Color3.fromRGB(255, 80, 0)
    fire.SecondaryColor = Color3.fromRGB(240, 30, 0)
    fire.Parent         = stem

    -- Rising smoke column
    local stemSmoke                 = Instance.new("ParticleEmitter")
    stemSmoke.Texture               = "rbxassetid://3166619987"
    stemSmoke.Rate                  = 120
    stemSmoke.Lifetime              = NumberRange.new(5, 10)
    stemSmoke.Speed                 = NumberRange.new(60, 120)
    stemSmoke.SpreadAngle           = Vector2.new(8, 8)
    stemSmoke.Color                 = ColorSequence.new({
        ColorSequenceKeypoint.new(0,   Color3.fromRGB(255, 100, 20)),
        ColorSequenceKeypoint.new(0.3, Color3.fromRGB(100, 80, 65)),
        ColorSequenceKeypoint.new(1,   Color3.fromRGB(45,  42, 40)),
    })
    stemSmoke.Size                  = NumberSequence.new({
        NumberSequenceKeypoint.new(0, 8),
        NumberSequenceKeypoint.new(1, 50),
    })
    stemSmoke.Transparency          = NumberSequence.new({
        NumberSequenceKeypoint.new(0, 0.1),
        NumberSequenceKeypoint.new(1, 1),
    })
    stemSmoke.LightEmission         = 0.5
    stemSmoke.RotSpeed              = NumberRange.new(-30, 30)
    stemSmoke.Rotation              = NumberRange.new(0, 360)
    stemSmoke.Parent                = stem

    -- ── Cap (mushroom head) ───────────────────────────────────
    local cap           = Instance.new("Part")
    cap.Name            = "Cap"
    cap.Shape           = Enum.PartType.Ball
    cap.Anchored        = true
    cap.CanCollide      = false
    cap.CastShadow      = false
    cap.Size            = Vector3.new(5, 5, 5)
    cap.Position        = Vector3.new(pos.X, pos.Y + height * 0.8, pos.Z)
    cap.Material        = Enum.Material.SmoothPlastic
    cap.Color           = Color3.fromRGB(50, 42, 35)
    cap.Parent          = cloud

    local capSmoke              = stemSmoke:Clone()
    capSmoke.Rate               = 200
    capSmoke.Speed              = NumberRange.new(20, 60)
    capSmoke.SpreadAngle        = Vector2.new(60, 60)
    capSmoke.Parent             = cap

    -- ── Glow core at ground ───────────────────────────────────
    local glow          = Instance.new("Part")
    glow.Shape          = Enum.PartType.Ball
    glow.Size           = Vector3.new(60, 60, 60)
    glow.Position       = Vector3.new(pos.X, pos.Y + 30, pos.Z)
    glow.Anchored       = true
    glow.CanCollide     = false
    glow.CastShadow     = false
    glow.Material       = Enum.Material.Neon
    glow.Color          = Color3.fromRGB(255, 130, 20)
    glow.Transparency   = 0.4
    glow.Parent         = cloud

    cloud.Parent = workspace

    -- Animate stem growing upward
    TweenService:Create(stem, TweenInfo.new(3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
        Size     = Vector3.new(35, height * 0.75, 35),
        Position = Vector3.new(pos.X, pos.Y + height * 0.375, pos.Z),
    }):Play()

    -- Animate cap expanding
    TweenService:Create(cap, TweenInfo.new(3.5, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
        Size = Vector3.new(200, 110, 200),
    }):Play()

    -- Fade glow out
    TweenService:Create(glow, TweenInfo.new(5, Enum.EasingStyle.Quad), {
        Transparency = 1,
        Size         = Vector3.new(10, 10, 10),
    }):Play()

    Debris:AddItem(cloud, 90)
end

-- ─────────────────────────────────────────────────────────────
-- Shockwave ring
-- ─────────────────────────────────────────────────────────────
local function SpawnShockwave(pos, maxRadius, duration)
    -- Outer neon ring
    local ring          = Instance.new("Part")
    ring.Name           = "Shockwave"
    ring.Shape          = Enum.PartType.Cylinder
    ring.Size           = Vector3.new(0.8, 20, 20)
    ring.Position       = Vector3.new(pos.X, pos.Y + 8, pos.Z)
    ring.Orientation    = Vector3.new(0, 0, 90)
    ring.Anchored       = true
    ring.CanCollide     = false
    ring.CastShadow     = false
    ring.Material       = Enum.Material.Neon
    ring.Color          = Color3.fromRGB(255, 140, 40)
    ring.Transparency   = 0.2
    ring.Parent         = workspace

    -- Dust cloud along wave
    local dustEmit                  = Instance.new("ParticleEmitter")
    dustEmit.Texture                = "rbxassetid://3166619987"
    dustEmit.Rate                   = 300
    dustEmit.Lifetime               = NumberRange.new(1, 3)
    dustEmit.Speed                  = NumberRange.new(60, 120)
    dustEmit.SpreadAngle            = Vector2.new(30, 30)
    dustEmit.Color                  = ColorSequence.new(Color3.fromRGB(180, 150, 100))
    dustEmit.Size                   = NumberSequence.new(10)
    dustEmit.LightEmission          = 0.6
    dustEmit.Parent                 = ring

    local maxD = maxRadius * 2
    TweenService:Create(ring, TweenInfo.new(duration, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), {
        Size         = Vector3.new(0.8, maxD, maxD),
        Transparency = 1,
        Position     = Vector3.new(pos.X, pos.Y + 3, pos.Z),
    }):Play()

    Debris:AddItem(ring, duration + 1)
end

-- ─────────────────────────────────────────────────────────────
-- Ground fire ring
-- ─────────────────────────────────────────────────────────────
local function SpawnGroundFire(pos, radius)
    local NUM_FIRES = 20
    for i = 1, NUM_FIRES do
        local angle  = (i / NUM_FIRES) * math.pi * 2
        local r      = math.random(radius * 0.3, radius * 0.8)
        local fp     = Vector3.new(
            pos.X + math.cos(angle) * r,
            pos.Y,
            pos.Z + math.sin(angle) * r
        )

        local part          = Instance.new("Part")
        part.Size           = Vector3.new(1, 1, 1)
        part.Position       = fp
        part.Anchored       = true
        part.CanCollide     = false
        part.Transparency   = 1
        part.Parent         = workspace

        local f             = Instance.new("Fire")
        f.Size              = math.random(10, 25)
        f.Heat              = 15
        f.Color             = Color3.fromRGB(255, 80, 0)
        f.SecondaryColor    = Color3.fromRGB(200, 40, 0)
        f.Parent            = part

        Debris:AddItem(part, 30)
    end
end

-- ─────────────────────────────────────────────────────────────
-- Event: NukeWarning  (siren + start countdown UI via NukeUI)
-- ─────────────────────────────────────────────────────────────
RE_Warning.OnClientEvent:Connect(function(eventType, data)
    if eventType == "WARNING" then
        -- Looping global siren
        sirenSound          = Instance.new("Sound")
        sirenSound.SoundId  = Config.SND_SIREN
        sirenSound.Volume   = 0.85
        sirenSound.Looped   = true
        sirenSound.Parent   = SoundService
        sirenSound:Play()

        -- Missile travel sound (3-D at target)
        local snd, anchor = Play3DSound(Config.SND_TRAVEL, data.targetPos, 0.6, true)
        travelSoundObj    = { snd = snd, anchor = anchor }

    elseif eventType == "CANCEL" then
        if sirenSound  then sirenSound:Stop();  sirenSound:Destroy();  sirenSound = nil  end
        if travelSoundObj then
            travelSoundObj.snd:Stop()
            travelSoundObj.anchor:Destroy()
            travelSoundObj = nil
        end
    end
end)

-- ─────────────────────────────────────────────────────────────
-- Event: NukeImpact  (everything at the moment of detonation)
-- ─────────────────────────────────────────────────────────────
RE_Impact.OnClientEvent:Connect(function(data)
    local pos = data.position

    -- Stop warning sounds
    if sirenSound  then sirenSound:Stop();  sirenSound:Destroy();  sirenSound = nil  end
    if travelSoundObj then
        travelSoundObj.snd:Stop()
        travelSoundObj.anchor:Destroy()
        travelSoundObj = nil
    end

    -- Camera shake scaled by distance
    local char = LocalPlayer.Character
    local hrp  = char and char:FindFirstChild("HumanoidRootPart")
    if hrp then
        local dist      = (hrp.Position - pos).Magnitude
        local intensity = math.max(0, 1 - dist / data.shakeDist) * 6
        if intensity > 0.05 then
            Shake(intensity, 4.5)
        end
    end

    -- Flash
    NuclearFlash(data.flashDuration or Config.FLASH_DURATION)

    -- Explosion boom
    Play3DSound(Config.SND_EXPLOSION, pos, 1.0, false, 4000)

    -- Shockwave rumble (slight delay)
    task.delay(0.6, function()
        Play3DSound(Config.SND_SHOCKWAVE, pos, 0.9, false, 4000)
    end)

    -- Mushroom cloud
    task.delay(0.2, function()
        SpawnMushroomCloud(pos, data.mushHeight or Config.MUSHROOM_HEIGHT)
    end)

    -- Shockwave ring
    task.delay(0.15, function()
        SpawnShockwave(pos, data.shockwaveRadius, data.shockDuration or Config.SHOCKWAVE_DURATION)
    end)

    -- Ground fire ring
    task.delay(0.4, function()
        SpawnGroundFire(pos, 150)
    end)
end)

print("[NukeClient] ✅ VFX system ready.")
