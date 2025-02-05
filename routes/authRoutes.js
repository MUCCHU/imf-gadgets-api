const express = require("express");
const { User } = require("../models");
const { generateToken, hashPassword, comparePassword } = require("../utils/auth");

const router = express.Router();

// POST: Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error("POST /auth/register Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// POST: Login and get a token
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("POST /auth/login Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
