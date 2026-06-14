require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   SIGNAL CAPTURE v1.8 ENGINE
========================= */

let clarificationAsked = false;

const BASE_PROMPT = `
You are Signal Capture v1.8.

You must produce structured output with:

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:
NEXT BEST ACTION:

Actions must be real-world and immediate.

Do not ask multiple clarifying questions.
`;

const CLARIFY_PROMPT = `
User input is vague.

Ask ONE clarifying question.

Return ONLY:

CLARIFYING QUESTION:
[one precise real-world question]
`;

const FULL_PROMPT = `
You must now produce FULL output.

You are NOT allowed to ask any clarifying questions.

Even if the input is vague, proceed anyway.

Return full structure:

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:
NEXT BEST ACTION:
`;

function isVague(input) {
  const vagueWords = ["stuck", "confused", "not sure", "everything", "nothing"];
  return vagueWords.some(word => input.toLowerCase().includes(word));
}

/* =========================
   ROUTES
========================= */

app.post("/generate", async (req, res) => {
  const { input } = req.body;

  if (!input || !input.trim()) {
    return res.status(400).json({ output: "Enter a valid signal." });
  }

  let systemPrompt;

  if (!clarificationAsked && isVague(input)) {
    systemPrompt = BASE_PROMPT + CLARIFY_PROMPT;
    clarificationAsked = true;
  } else {
    systemPrompt = BASE_PROMPT + FULL_PROMPT;
    clarificationAsked = false; // reset after full response
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
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    const data = await response.json();

    const output =
      data?.choices?.[0]?.message?.content ||
      "No response returned.";

    return res.json({ output });

  } catch (error) {
    return res.status(500).json({
      output: "Server error."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Signal Capture v1.8 running on port ${PORT}`);
});
