-- ============================================================
-- NukeUI.client.lua  |  LocalScript
-- Place: StarterPlayerScripts > NukeUI
-- Builds + drives: warning banner, countdown, flash overlay,
--                  cooldown HUD, damage notification
-- ============================================================

local Players      = game:GetService("Players")
local TweenService = game:GetService("TweenService")

local LocalPlayer  = Players.LocalPlayer
local PlayerGui    = LocalPlayer:WaitForChild("PlayerGui")

local RS           = game:GetService("ReplicatedStorage")
local NukeSystem   = RS:WaitForChild("NukeSystem")
local Remotes      = NukeSystem:WaitForChild("RemoteEvents")
local Config       = require(NukeSystem:WaitForChild("Modules"):WaitForChild("NukeConfig"))

local RE_Warning   = Remotes:WaitForChild("NukeWarning")
local RE_Impact    = Remotes:WaitForChild("NukeImpact")
local RE_Damage    = Remotes:WaitForChild("NukeDamage")
local RE_Status    = Remotes:WaitForChild("NukeStatus")

-- ─────────────────────────────────────────────────────────────
-- Build all GUI elements once
-- ─────────────────────────────────────────────────────────────
local function MakeGui()
    -- ── Root ─────────────────────────────────────────────────
    local root                  = Instance.new("ScreenGui")
    root.Name                   = "NukeUI"
    root.ResetOnSpawn           = false
    root.DisplayOrder           = 50
    root.ZIndexBehavior         = Enum.ZIndexBehavior.Sibling
    root.Parent                 = PlayerGui

    -- ── Warning banner (slides in from top) ──────────────────
    local banner                = Instance.new("Frame")
    banner.Name                 = "Banner"
    banner.Size                 = UDim2.new(1, 0, 0, 64)
    banner.Position             = UDim2.new(0, 0, 0, -64)
    banner.BackgroundColor3     = Color3.fromRGB(170, 0, 0)
    banner.BorderSizePixel      = 0
    banner.ZIndex               = 10
    banner.Parent               = root

    local bannerGrad            = Instance.new("UIGradient")
    bannerGrad.Color            = ColorSequence.new({
        ColorSequenceKeypoint.new(0,   Color3.fromRGB(200, 0,  0)),
        ColorSequenceKeypoint.new(0.5, Color3.fromRGB(240, 30, 0)),
        ColorSequenceKeypoint.new(1,   Color3.fromRGB(200, 0,  0)),
    })
    bannerGrad.Rotation         = 90
    bannerGrad.Parent           = banner

    local bannerTxt             = Instance.new("TextLabel")
    bannerTxt.Name              = "Text"
    bannerTxt.Size              = UDim2.new(1, 0, 1, 0)
    bannerTxt.BackgroundTransparency = 1
    bannerTxt.Text              = "☢  NUCLEAR STRIKE INBOUND  ☢"
    bannerTxt.TextColor3        = Color3.fromRGB(255, 255, 255)
    bannerTxt.TextSize          = 28
    bannerTxt.Font              = Enum.Font.GothamBold
    bannerTxt.ZIndex            = 11
    bannerTxt.Parent            = banner

    -- Subtle scanline stripe
    local stripe                = Instance.new("Frame")
    stripe.Size                 = UDim2.new(1, 0, 0, 3)
    stripe.Position             = UDim2.new(0, 0, 1, -3)
    stripe.BackgroundColor3     = Color3.fromRGB(255, 255, 255)
    stripe.BackgroundTransparency = 0.7
    stripe.BorderSizePixel      = 0
    stripe.Parent               = banner

    -- ── Countdown box ─────────────────────────────────────────
    local cdBox                 = Instance.new("Frame")
    cdBox.Name                  = "CountdownBox"
    cdBox.Size                  = UDim2.new(0, 200, 0, 110)
    cdBox.AnchorPoint           = Vector2.new(0.5, 0)
    cdBox.Position              = UDim2.new(0.5, 0, 0, 72)
    cdBox.BackgroundColor3      = Color3.fromRGB(8, 0, 0)
    cdBox.BackgroundTransparency= 0.25
    cdBox.BorderSizePixel       = 0
    cdBox.Visible               = false
    cdBox.ZIndex                = 10
    cdBox.Parent                = root
    Instance.new("UICorner", cdBox).CornerRadius = UDim.new(0, 14)

    local cdBorder              = Instance.new("UIStroke")
    cdBorder.Color              = Color3.fromRGB(200, 30, 0)
    cdBorder.Thickness          = 2
    cdBorder.Transparency       = 0.4
    cdBorder.Parent             = cdBox

    local cdNum                 = Instance.new("TextLabel")
    cdNum.Name                  = "Timer"
    cdNum.Size                  = UDim2.new(1, 0, 0.6, 0)
    cdNum.Position              = UDim2.new(0, 0, 0.08, 0)
    cdNum.BackgroundTransparency= 1
    cdNum.Text                  = "15"
    cdNum.TextColor3            = Color3.fromRGB(255, 50, 50)
    cdNum.TextSize              = 58
    cdNum.Font                  = Enum.Font.GothamBold
    cdNum.ZIndex                = 11
    cdNum.Parent                = cdBox

    local cdSub                 = Instance.new("TextLabel")
    cdSub.Size                  = UDim2.new(1, 0, 0.28, 0)
    cdSub.Position              = UDim2.new(0, 0, 0.72, 0)
    cdSub.BackgroundTransparency= 1
    cdSub.Text                  = "SECONDS TO IMPACT"
    cdSub.TextColor3            = Color3.fromRGB(180, 80, 80)
    cdSub.TextSize              = 11
    cdSub.Font                  = Enum.Font.GothamBold
    cdSub.ZIndex                = 11
    cdSub.Parent                = cdBox

    -- ── Nuclear flash overlay ─────────────────────────────────
    local flashGui              = Instance.new("ScreenGui")
    flashGui.Name               = "NukeFlash"
    flashGui.DisplayOrder       = 200
    flashGui.ResetOnSpawn       = false
    flashGui.Parent             = PlayerGui

    local flashFrame            = Instance.new("Frame")
    flashFrame.Name             = "FlashFrame"
    flashFrame.Size             = UDim2.new(1, 0, 1, 0)
    flashFrame.BackgroundColor3 = Color3.fromRGB(255, 255, 240)
    flashFrame.BackgroundTransparency = 1
    flashFrame.BorderSizePixel  = 0
    flashFrame.ZIndex           = 200
    flashFrame.Parent           = flashGui

    -- ── Cooldown HUD (bottom-left) ────────────────────────────
    local cdHUD                 = Instance.new("Frame")
    cdHUD.Name                  = "CooldownHUD"
    cdHUD.Size                  = UDim2.new(0, 220, 0, 44)
    cdHUD.Position              = UDim2.new(0, 14, 1, -58)
    cdHUD.BackgroundColor3      = Color3.fromRGB(8, 6, 10)
    cdHUD.BackgroundTransparency= 0.35
    cdHUD.BorderSizePixel       = 0
    cdHUD.Visible               = false
    cdHUD.ZIndex                = 5
    cdHUD.Parent                = root
    Instance.new("UICorner", cdHUD).CornerRadius = UDim.new(0, 10)

    local cdHUDStroke           = Instance.new("UIStroke")
    cdHUDStroke.Color           = Color3.fromRGB(160, 100, 20)
    cdHUDStroke.Thickness       = 1.5
    cdHUDStroke.Transparency    = 0.5
    cdHUDStroke.Parent          = cdHUD

    local cdHUDLabel            = Instance.new("TextLabel")
    cdHUDLabel.Name             = "Label"
    cdHUDLabel.Size             = UDim2.new(1, -12, 1, 0)
    cdHUDLabel.Position         = UDim2.new(0, 12, 0, 0)
    cdHUDLabel.BackgroundTransparency = 1
    cdHUDLabel.Text             = "☢  Nuke Ready"
    cdHUDLabel.TextColor3       = Color3.fromRGB(100, 255, 100)
    cdHUDLabel.TextSize         = 14
    cdHUDLabel.Font             = Enum.Font.GothamBold
    cdHUDLabel.TextXAlignment   = Enum.TextXAlignment.Left
    cdHUDLabel.ZIndex           = 6
    cdHUDLabel.Parent           = cdHUD

    -- ── Damage toast (top-right) ──────────────────────────────
    local dmgToast              = Instance.new("Frame")
    dmgToast.Name               = "DmgToast"
    dmgToast.Size               = UDim2.new(0, 200, 0, 56)
    dmgToast.AnchorPoint        = Vector2.new(1, 0)
    dmgToast.Position           = UDim2.new(1, -14, 0, 80)
    dmgToast.BackgroundColor3   = Color3.fromRGB(140, 0, 0)
    dmgToast.BackgroundTransparency = 0.3
    dmgToast.BorderSizePixel    = 0
    dmgToast.Visible            = false
    dmgToast.ZIndex             = 15
    dmgToast.Parent             = root
    Instance.new("UICorner", dmgToast).CornerRadius = UDim.new(0, 10)

    local dmgLabel              = Instance.new("TextLabel")
    dmgLabel.Name               = "Label"
    dmgLabel.Size               = UDim2.new(1, -10, 1, 0)
    dmgLabel.Position           = UDim2.new(0, 10, 0, 0)
    dmgLabel.BackgroundTransparency = 1
    dmgLabel.Text               = "☢ -75 HP (Nuclear Blast)"
    dmgLabel.TextColor3         = Color3.fromRGB(255, 200, 200)
    dmgLabel.TextSize           = 14
    dmgLabel.Font               = Enum.Font.GothamBold
    dmgLabel.TextXAlignment     = Enum.TextXAlignment.Left
    dmgLabel.TextWrapped        = true
    dmgLabel.ZIndex             = 16
    dmgLabel.Parent             = dmgToast

    return {
        banner   = banner,
        cdBox    = cdBox,
        cdNum    = cdNum,
        cdHUD    = cdHUD,
        cdLabel  = cdHUDLabel,
        dmgToast = dmgToast,
        dmgLabel = dmgLabel,
    }
end

local UI = MakeGui()

-- ─────────────────────────────────────────────────────────────
-- Warning: slide banner in, start countdown loop
-- ─────────────────────────────────────────────────────────────
local countdownThread

RE_Warning.OnClientEvent:Connect(function(eventType, data)
    if eventType == "WARNING" then
        -- Slide banner down
        TweenService:Create(UI.banner, TweenInfo.new(0.35, Enum.EasingStyle.Back), {
            Position = UDim2.new(0, 0, 0, 0)
        }):Play()

        -- Blink effect
        task.spawn(function()
            for i = 1, 30 do
                task.wait(0.35)
                UI.banner.BackgroundColor3 = (i % 2 == 0)
                    and Color3.fromRGB(170, 0,  0)
                    or  Color3.fromRGB(240, 35, 0)
            end
        end)

        -- Countdown
        UI.cdBox.Visible = true
        if countdownThread then task.cancel(countdownThread) end
        countdownThread = task.spawn(function()
            local t = data.countdown
            while t > 0 do
                UI.cdNum.Text = tostring(t)
                if t <= 5 then
                    UI.cdNum.TextColor3 = Color3.fromRGB(255, 0, 0)
                    TweenService:Create(UI.cdNum, TweenInfo.new(0.15), {
                        TextSize = 66
                    }):Play()
                    task.wait(0.15)
                    TweenService:Create(UI.cdNum, TweenInfo.new(0.15), {
                        TextSize = 58
                    }):Play()
                end
                task.wait(1)
                t = t - 1
            end
            UI.cdNum.Text = "💥"
        end)

    elseif eventType == "CANCEL" then
        if countdownThread then task.cancel(countdownThread) end
        TweenService:Create(UI.banner, TweenInfo.new(0.3), {
            Position = UDim2.new(0, 0, 0, -64)
        }):Play()
        task.wait(0.4)
        UI.cdBox.Visible = false
    end
end)

-- ─────────────────────────────────────────────────────────────
-- Impact: hide warning UI after 2 seconds
-- ─────────────────────────────────────────────────────────────
RE_Impact.OnClientEvent:Connect(function()
    if countdownThread then task.cancel(countdownThread) end
    task.wait(2)
    TweenService:Create(UI.banner, TweenInfo.new(0.4), {
        Position = UDim2.new(0, 0, 0, -64)
    }):Play()
    task.wait(0.5)
    UI.cdBox.Visible = false
end)

-- ─────────────────────────────────────────────────────────────
-- Damage toast
-- ─────────────────────────────────────────────────────────────
RE_Damage.OnClientEvent:Connect(function(dmg, dist)
    local txt = dmg == math.huge
        and "☢ LETHAL BLAST — Instant Kill"
        or string.format("☢ -%d HP (%.0f studs away)", dmg, dist)

    UI.dmgLabel.Text       = txt
    UI.dmgToast.Visible    = true
    UI.dmgToast.BackgroundTransparency = 0.3
    TweenService:Create(UI.dmgToast, TweenInfo.new(0.2), {
        BackgroundTransparency = 0.1
    }):Play()
    task.wait(3)
    TweenService:Create(UI.dmgToast, TweenInfo.new(0.5), {
        BackgroundTransparency = 1
    }):Play()
    task.wait(0.6)
    UI.dmgToast.Visible = false
end)

-- ─────────────────────────────────────────────────────────────
-- Launch status / cooldown HUD
-- ─────────────────────────────────────────────────────────────
RE_Status.OnClientEvent:Connect(function(data)
    UI.cdHUD.Visible = true

    if not data.success then
        UI.cdLabel.Text       = "✗  " .. (data.reason or "Cannot launch")
        UI.cdLabel.TextColor3 = Color3.fromRGB(255, 80, 80)
        task.delay(4, function() UI.cdHUD.Visible = false end)
        return
    end

    -- Tick down cooldown
    local endTime = tick() + Config.COOLDOWN_SECONDS
    task.spawn(function()
        while tick() < endTime do
            local rem  = math.ceil(endTime - tick())
            local mins = math.floor(rem / 60)
            local secs = rem % 60
            UI.cdLabel.Text       = string.format("☢  Cooldown  %d:%02d", mins, secs)
            UI.cdLabel.TextColor3 = Color3.fromRGB(220, 160, 40)
            task.wait(1)
        end
        UI.cdLabel.Text       = "☢  Nuke Ready"
        UI.cdLabel.TextColor3 = Color3.fromRGB(100, 255, 100)
        task.delay(5, function() UI.cdHUD.Visible = false end)
    end)
end)

print("[NukeUI] ✅ UI system ready.")
