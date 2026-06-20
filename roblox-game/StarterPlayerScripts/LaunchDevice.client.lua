-- ============================================================
-- LaunchDevice.client.lua  |  LocalScript
-- Place: StarterPlayerScripts > LaunchDevice
-- Handles: equip/unequip the NukeLaunchDevice tool,
--          blast-radius preview rings on mouse hover,
--          click to confirm + fire RemoteEvent
-- ============================================================

local Players          = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService       = game:GetService("RunService")
local TweenService     = game:GetService("TweenService")

local LocalPlayer      = Players.LocalPlayer
local Mouse            = LocalPlayer:GetMouse()
local PlayerGui        = LocalPlayer:WaitForChild("PlayerGui")
local Camera           = workspace.CurrentCamera

local RS               = game:GetService("ReplicatedStorage")
local NukeSystem       = RS:WaitForChild("NukeSystem")
local Remotes          = NukeSystem:WaitForChild("RemoteEvents")
local Config           = require(NukeSystem:WaitForChild("Modules"):WaitForChild("NukeConfig"))

local RE_Launch        = Remotes:WaitForChild("LaunchNuke")

-- State
local equipped         = false
local indicator        = nil    -- radius preview part
local confirmGui       = nil    -- confirm dialog

-- ─────────────────────────────────────────────────────────────
-- Build radius preview (3 concentric rings for each zone)
-- ─────────────────────────────────────────────────────────────
local ZONE_COLORS = {
    Color3.fromRGB(255, 0,   0),    -- Zone 1: red   (instant kill)
    Color3.fromRGB(255, 140, 0),    -- Zone 2: orange
    Color3.fromRGB(255, 220, 0),    -- Zone 3: yellow
}

local function CreateIndicator()
    local root          = Instance.new("Model")
    root.Name           = "NukeIndicator"

    for i, zone in ipairs(Config.ZONES) do
        local ring          = Instance.new("Part")
        ring.Shape          = Enum.PartType.Cylinder
        local d             = zone.maxRadius * 2
        ring.Size           = Vector3.new(0.5, d, d)
        ring.Orientation    = Vector3.new(0, 0, 90)
        ring.Anchored       = true
        ring.CanCollide     = false
        ring.CastShadow     = false
        ring.Material       = Enum.Material.Neon
        ring.Color          = ZONE_COLORS[i]
        ring.Transparency   = 0.35
        ring.Parent         = root
    end

    -- Inner fill circle at ground level
    local fill          = Instance.new("Part")
    fill.Size           = Vector3.new(0.2, Config.ZONES[1].maxRadius * 2, Config.ZONES[1].maxRadius * 2)
    fill.Orientation    = Vector3.new(0, 0, 90)
    fill.Anchored       = true
    fill.CanCollide     = false
    fill.CastShadow     = false
    fill.Material       = Enum.Material.Neon
    fill.Color          = Color3.fromRGB(255, 0, 0)
    fill.Transparency   = 0.75
    fill.Parent         = root

    root.Parent = workspace
    return root
end

local function DestroyIndicator()
    if indicator then
        indicator:Destroy()
        indicator = nil
    end
end

-- Move all rings to the current mouse hit position
local function UpdateIndicatorPosition(pos)
    if not indicator then return end
    local groundPos = Vector3.new(pos.X, 0.3, pos.Z)
    for _, part in ipairs(indicator:GetChildren()) do
        if part:IsA("BasePart") then
            part.Position = groundPos
        end
    end
end

-- ─────────────────────────────────────────────────────────────
-- Confirm dialog
-- ─────────────────────────────────────────────────────────────
local function ShowConfirm(targetPos, onYes, onNo)
    if confirmGui then confirmGui:Destroy() end

    local sg = Instance.new("ScreenGui")
    sg.Name           = "NukeConfirm"
    sg.DisplayOrder   = 100
    sg.ResetOnSpawn   = false
    sg.Parent         = PlayerGui

    -- Backdrop
    local bg = Instance.new("Frame")
    bg.Size  = UDim2.new(1, 0, 1, 0)
    bg.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
    bg.BackgroundTransparency = 0.55
    bg.BorderSizePixel = 0
    bg.Parent = sg

    -- Card
    local card = Instance.new("Frame")
    card.Size         = UDim2.new(0, 340, 0, 180)
    card.AnchorPoint  = Vector2.new(0.5, 0.5)
    card.Position     = UDim2.new(0.5, 0, 0.5, 0)
    card.BackgroundColor3 = Color3.fromRGB(14, 8, 8)
    card.BackgroundTransparency = 0.05
    card.BorderSizePixel = 0
    card.Parent       = sg
    Instance.new("UICorner", card).CornerRadius = UDim.new(0, 16)

    local stroke = Instance.new("UIStroke")
    stroke.Color = Color3.fromRGB(200, 30, 0)
    stroke.Thickness = 2
    stroke.Parent = card

    local title = Instance.new("TextLabel")
    title.Size  = UDim2.new(1, 0, 0, 50)
    title.Position = UDim2.new(0, 0, 0, 10)
    title.BackgroundTransparency = 1
    title.Text  = "☢  LAUNCH NUCLEAR STRIKE?"
    title.TextColor3 = Color3.fromRGB(255, 60, 60)
    title.TextSize = 18
    title.Font  = Enum.Font.GothamBold
    title.Parent = card

    local sub = Instance.new("TextLabel")
    sub.Size   = UDim2.new(1, -20, 0, 40)
    sub.Position = UDim2.new(0, 10, 0, 55)
    sub.BackgroundTransparency = 1
    sub.Text   = string.format(
        "Target: (%.0f, %.0f)\nCost: %d coins  |  Cooldown: 10 min",
        targetPos.X, targetPos.Z, Config.NUKE_COST
    )
    sub.TextColor3 = Color3.fromRGB(180, 160, 160)
    sub.TextSize = 13
    sub.Font   = Enum.Font.Gotham
    sub.TextWrapped = true
    sub.Parent = card

    -- Buttons
    local btnYes = Instance.new("TextButton")
    btnYes.Size  = UDim2.new(0, 130, 0, 40)
    btnYes.Position = UDim2.new(0.5, -140, 1, -52)
    btnYes.BackgroundColor3 = Color3.fromRGB(180, 0, 0)
    btnYes.Text  = "🚀  LAUNCH"
    btnYes.TextColor3 = Color3.fromRGB(255, 255, 255)
    btnYes.TextSize = 15
    btnYes.Font  = Enum.Font.GothamBold
    btnYes.BorderSizePixel = 0
    btnYes.Parent = card
    Instance.new("UICorner", btnYes).CornerRadius = UDim.new(0, 8)

    local btnNo = Instance.new("TextButton")
    btnNo.Size  = UDim2.new(0, 130, 0, 40)
    btnNo.Position = UDim2.new(0.5, 10, 1, -52)
    btnNo.BackgroundColor3 = Color3.fromRGB(35, 35, 40)
    btnNo.Text  = "Cancel"
    btnNo.TextColor3 = Color3.fromRGB(180, 180, 180)
    btnNo.TextSize = 15
    btnNo.Font  = Enum.Font.Gotham
    btnNo.BorderSizePixel = 0
    btnNo.Parent = card
    Instance.new("UICorner", btnNo).CornerRadius = UDim.new(0, 8)

    confirmGui = sg

    btnYes.MouseButton1Click:Connect(function()
        sg:Destroy()
        confirmGui = nil
        onYes()
    end)
    btnNo.MouseButton1Click:Connect(function()
        sg:Destroy()
        confirmGui = nil
        onNo()
    end)
end

-- ─────────────────────────────────────────────────────────────
-- Track mouse every frame to update indicator
-- ─────────────────────────────────────────────────────────────
RunService.RenderStepped:Connect(function()
    if not equipped or not indicator then return end

    -- Raycast to ground (ignore indicator, character)
    local ignore = { indicator }
    local char   = LocalPlayer.Character
    if char then table.insert(ignore, char) end

    local unitRay = Camera:ScreenPointToRay(Mouse.X, Mouse.Y)
    local ray     = Ray.new(unitRay.Origin, unitRay.Direction * 3000)
    local _, hit  = workspace:FindPartOnRayWithIgnoreList(ray, ignore)

    if hit then
        UpdateIndicatorPosition(hit)
    end
end)

-- ─────────────────────────────────────────────────────────────
-- Watch tools in backpack + character
-- ─────────────────────────────────────────────────────────────
local function OnEquip(tool)
    if tool.Name ~= "NukeLaunchDevice" then return end
    equipped  = true
    indicator = CreateIndicator()
    Mouse.Icon = "rbxasset://textures/GunCursor.png"
end

local function OnUnequip(tool)
    if tool.Name ~= "NukeLaunchDevice" then return end
    equipped = false
    DestroyIndicator()
    if confirmGui then confirmGui:Destroy(); confirmGui = nil end
    Mouse.Icon = ""
end

local function WatchCharacter(char)
    char.ChildAdded:Connect(function(obj)
        if obj:IsA("Tool") then
            obj.Equipped:Connect(function()   OnEquip(obj)   end)
            obj.Unequipped:Connect(function() OnUnequip(obj) end)
        end
    end)
end

LocalPlayer.CharacterAdded:Connect(WatchCharacter)
if LocalPlayer.Character then WatchCharacter(LocalPlayer.Character) end

-- Also watch backpack
LocalPlayer:WaitForChild("Backpack").ChildAdded:Connect(function(tool)
    if tool:IsA("Tool") then
        tool.Equipped:Connect(function()   OnEquip(tool)   end)
        tool.Unequipped:Connect(function() OnUnequip(tool) end)
    end
end)

-- ─────────────────────────────────────────────────────────────
-- Left-click while equipped → confirm then fire
-- ─────────────────────────────────────────────────────────────
UserInputService.InputBegan:Connect(function(input, processed)
    if processed or not equipped then return end
    if input.UserInputType ~= Enum.UserInputType.MouseButton1 then return end
    if confirmGui then return end   -- already open

    -- Get target position from mouse hit
    local ignore  = {}
    local char    = LocalPlayer.Character
    if char and indicator then
        table.insert(ignore, char)
        table.insert(ignore, indicator)
    end
    local unitRay = Camera:ScreenPointToRay(Mouse.X, Mouse.Y)
    local ray     = Ray.new(unitRay.Origin, unitRay.Direction * 3000)
    local _, hitPos = workspace:FindPartOnRayWithIgnoreList(ray, ignore)

    if not hitPos then return end

    local targetPos = Vector3.new(hitPos.X, 0, hitPos.Z)

    ShowConfirm(targetPos,
        -- YES
        function()
            RE_Launch:FireServer(targetPos)
            equipped = false
            DestroyIndicator()
            Mouse.Icon = ""
            -- Un-equip tool
            local c = LocalPlayer.Character
            if c then
                local tool = c:FindFirstChildOfClass("Tool")
                if tool then
                    tool.Parent = LocalPlayer.Backpack
                end
            end
        end,
        -- NO
        function()
            -- keep device equipped, just close dialog
        end
    )
end)

print("[LaunchDevice] ✅ Launch device ready.")
