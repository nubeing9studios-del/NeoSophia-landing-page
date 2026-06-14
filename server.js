require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const PORT = process.env.PORT || 3000;

/* =========================
   STATE HANDLING (NEW)
========================= */

let awaitingClarification = false;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   SIGNAL CAPTURE v1.6.2 ENGINE (STATE FIXED)
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v1.6.2.

You are a high-precision diagnostic engine with emotional grounding.

Your purpose:
- detect the real issue
- acknowledge the human reality
- deliver clear insight
- produce ONE decisive real-world action

-------------------------------------

CORE OUTPUT STRUCTURE

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:
NEXT BEST ACTION:

-------------------------------------

EMOTIONAL RECOGNITION

- 1–2 lines
- grounded, real, specific
- no generic phrases

-------------------------------------

DIAGNOSTIC ORDER

1. Biological
2. External Reality
3. Identity Protection
4. Cognitive Overload
5. Avoidance

-------------------------------------

BIOLOGICAL OVERRIDE

If exhausted:

SIGNAL: Biological Override
STATE: System Depletion
DISTORTION: N/A

-------------------------------------

EXTERNAL REALITY RULE

If real-world constraints exist → treat as real.

-------------------------------------

INSIGHT RULES

- must reveal something new
- must be direct
- no repetition

-------------------------------------

ACTION ENGINE

Actions must:
- be immediate
- be real-world
- be visible or commitment-based

-------------------------------------

ACTION FINALITY RULE

The NEXT BEST ACTION must:
- be completed within 10 minutes
- produce visible movement

If not → invalid

-------------------------------------

CLARIFYING QUESTION RULE

If input is vague:

Return ONLY:

CLARIFYING QUESTION:
[one specific question]

-------------------------------------

CLARIFICATION LIMIT RULE

You may ask ONLY ONE clarifying question.

After the user responds:

You MUST produce full output.

DO NOT ask another question.

-------------------------------------

FORMAT RULE

If asking a question:

ONLY return:

CLARIFYING QUESTION:
...

-------------------------------------

TONE

Calm. Human. Precise.

-------------------------------------

END.
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v1.6.2 running.");
});

app.post("/generate", async (req, res) => {
  const { input } = req.body;

  if (!input || !input.trim()) {
    return res.status(400).json({ output: "Enter a valid signal." });
  }

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ output: "Missing API key." });
  }

  try {
    let messages = [
      { role: "system", content: SIGNAL_CAPTURE_SYSTEM_PROMPT }
    ];

    if (awaitingClarification) {
      messages.push({
        role: "user",
        content: `This is the user's answer to a clarifying question. You MUST now give a full diagnostic response.\n\nUser answer: ${input}`
      });
    } else {
      messages.push({
        role: "user",
        content: input
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${OPENROUTER_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: messages,
        temperature: 0.2,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        output: \`API error: \${data?.error?.message || "Request failed"}\`
      });
    }

    const output =
      data?.choices?.[0]?.message?.content ||
      "No response returned.";

    /* =========================
       STATE SWITCHING (CRITICAL)
    ========================= */

    if (output.includes("CLARIFYING QUESTION:")) {
      awaitingClarification = true;
    } else {
      awaitingClarification = false;
    }

    return res.json({ output });

  } catch (error) {
    return res.status(500).json({
      output: "Server error. Unable to process request."
    });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(\`Signal Capture v1.6.2 running on port \${PORT}\`);
});
