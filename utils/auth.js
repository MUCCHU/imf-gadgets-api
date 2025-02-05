const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Secret key from .env
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
};

// Function to hash a password before storing it
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Function to verify a hashed password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, hashPassword, comparePassword };
