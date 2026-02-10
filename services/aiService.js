const axios = require("axios");

const askAI = async (question) => {
  try {
    if (!process.env.GEMINI_KEY) {
      throw new Error("API key missing");
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [{ parts: [{ text: question }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty AI response");

    return text.trim().split(/\s+/)[0];
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    throw new Error("AI service failed");
  }
};

module.exports = { askAI };
