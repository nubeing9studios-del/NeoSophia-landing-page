require("dotenv").config();
const express = require("express");
const app = express();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, style.css, script.js

app.post("/generate", async (req, res) => {
  const { input } = req.body;

  if (!input || !input.trim()) {
    return res.status(400).json({ error: "No input provided." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a clarity and reflection assistant. The user has shared a thought or tension. Respond with a short, structured insight (3–5 sentences) that helps them see it more clearly and identify one concrete action they could take.\n\nUser signal: ${input}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ output: "API error: " + data.error.message });
    }

    res.json({ output: data.content[0].text });
  } catch (err) {
    res.status(500).json({ output: "Could not reach the AI. Check your API key and internet connection." });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
