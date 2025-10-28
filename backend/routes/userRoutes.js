// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    // Prevent multiple admins
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }

    // Validate Aadhar Card
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res.status(400).json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }

    const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this Aadhar already exists" });
    }

    const newUser = new User(data);
    const savedUser = await newUser.save();

    const token = generateToken({ id: savedUser._id });

    res.status(200).json({
      message: "Signup successful",
      user: savedUser.toObject(),
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    if (!aadharCardNumber || !password) {
      return res.status(400).json({ error: "Aadhar Card Number and password are required" });
    }

    const user = await User.findOne({ aadharCardNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid Aadhar Card Number or Password" });
    }

    const token = generateToken({ id: user._id });

    res.json({
      message: "Login successful",
      user: user.toObject(),
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Profile Route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update Password Route
router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new passwords are required" });
    }

    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
