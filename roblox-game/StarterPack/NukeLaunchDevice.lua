-- ============================================================
-- NukeLaunchDevice  |  Tool setup script (Script inside Tool)
-- Place: StarterPack > NukeLaunchDevice > Script
--
-- How to build the Tool in Roblox Studio:
--   1. Insert a Tool into StarterPack
--   2. Rename it exactly: NukeLaunchDevice
--   3. Add a Part named "Handle" inside the tool
--      (Shape: Cylinder, Size: 0.8,4,0.8, Material: Metal)
--   4. Add this Script inside the Tool
-- ============================================================

local tool   = script.Parent
local handle = tool:WaitForChild("Handle")

-- Style the handle when parented into workspace
tool.Equipped:Connect(function()
    handle.BrickColor = BrickColor.new("Dark stone grey")
    handle.Material   = Enum.Material.Metal
end)

-- Tooltip / description shown in hotbar
tool.ToolTip = "☢ Nuclear Launch Device — Click to target"

-- You can also set a custom texture on Handle here:
-- local mesh = Instance.new("SpecialMesh", handle)
-- mesh.MeshId = "rbxassetid://YOUR_MESH_ID"
-- mesh.TextureId = "rbxassetid://YOUR_TEXTURE_ID"
