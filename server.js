const express = require("express");
const dotenv = require("dotenv");
const { askAI } = require("./services/aiService");

dotenv.config();
const app = express();

app.use(express.json());
console.log("KEY =", process.env.GEMINI_KEY);


const EMAIL = "harry0514.be23@chitkara.edu.in";

// ---------------- HEALTH ----------------
app.get("/health", (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: EMAIL,
  });
});

// ---------------- HELPERS ----------------
const isPrime = (n) => {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

// ---------------- POST ----------------
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message: "Exactly one key required",
      });
    }

    const key = keys[0];
    const value = body[key];

    let result;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({ is_success: false });
        }
        const fib = [0, 1];
        for (let i = 2; i < value; i++) {
          fib.push(fib[i - 1] + fib[i - 2]);
        }
        result = value === 0 ? [] : fib.slice(0, value);
        break;

      case "prime":
        if (!Array.isArray(value)) {
          return res.status(400).json({ is_success: false });
        }
        result = value.filter(isPrime);
        break;

      case "lcm":
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({ is_success: false });
        }
        result = value.reduce((acc, n) => lcm(acc, n));
        break;

      case "hcf":
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({ is_success: false });
        }
        result = value.reduce((acc, n) => gcd(acc, n));
        break;

      case "AI":
        if (typeof value !== "string" || value.trim() === "") {
          return res.status(400).json({ is_success: false });
        }
        result = await askAI(value);
        break;

      default:
        return res.status(400).json({
          is_success: false,
          message: "Invalid key",
        });
    }

    return res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
