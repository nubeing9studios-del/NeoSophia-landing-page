require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.send("Signal Capture backend is live.");
});

app.post("/generate", async (req, res) => {
  const { input } = req.body;

  if (!input || !input.trim()) {
    return res.status(400).json({ output: "Please enter a signal." });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ output: "Missing Anthropic API key on server." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `You are a calm, clear reflection and clarity assistant.

The user has shared a thought, tension, or signal.

Respond in this exact format:

1. Reflection:
A short, clear reflection of what may be happening.

2. Clarity:
One simple insight that helps them see the situation more clearly.

3. Next step:
One concrete, calm action they can take now.

Keep the full response brief, supportive, and structured.
Do not be dramatic. Do not over-explain.

User signal: ${input}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.error ||
        "Anthropic API request failed.";
      return res.status(500).json({ output: `API error: ${message}` });
    }

    const output =
      data?.content?.[0]?.text ||
      "No response returned from the AI.";

    return res.json({ output });
  } catch (error) {
    return res.status(500).json({
      output: "Could not reach the AI service. Please check the server setup."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
