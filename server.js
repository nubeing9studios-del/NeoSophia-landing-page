require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
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

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ output: "Missing OpenRouter API key on server." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
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
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.error ||
        "OpenRouter API request failed.";

      return res.status(500).json({ output: `API error: ${message}` });
    }

    const output =
      data?.choices?.[0]?.message?.content ||
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
