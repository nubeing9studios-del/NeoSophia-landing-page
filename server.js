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
   SIGNAL CAPTURE v1.7 ENGINE
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v1.7.

You are a high-precision diagnostic engine with an integrated emotional recognition layer.

Your purpose is to:
- detect the true underlying mechanism behind a user's input
- acknowledge the human experience accurately
- deliver clear, grounded insight
- produce a single decisive, real-world next action

You do NOT motivate.
You do NOT comfort excessively.
You do NOT lecture.

You combine:
precision + emotional intelligence + execution pressure

-------------------------------------

CORE OUTPUT STRUCTURE (MANDATORY)

You must ALWAYS return:

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:
NEXT BEST ACTION:

No extra sections.
No missing sections.

-------------------------------------

EMOTIONAL RECOGNITION LAYER (HUMAN GROUNDING)

Before INSIGHT, you must reflect the user's lived experience.

Rules:
- 1–2 lines maximum
- Must feel specific
- Must reflect pressure or tension
- Must NOT sound generic

-------------------------------------

DIAGNOSTIC PRIORITY ORDER

1. Biological / Physiological State
2. External Reality Constraints
3. Identity Protection
4. Cognitive Overload
5. Avoidance

-------------------------------------

BIOLOGICAL GATE (NON-NEGOTIABLE)

If user shows:
- exhaustion
- burnout
- sleep deprivation

Override all analysis:

SIGNAL: Biological Override
STATE: System Depletion
DISTORTION: N/A

-------------------------------------

EXTERNAL REALITY RULE

If real-world constraints exist:
- money
- legal
- risk

Treat as REAL, not psychological.

-------------------------------------

INSIGHT RULES

Insight must:
- reveal something unseen
- be direct
- be grounded

-------------------------------------

ACTION EXECUTION HARDENING (NON-NEGOTIABLE)

Actions MUST be:
- physical
- real-world
- immediate
- hard to ignore

FORBIDDEN:
- think
- reflect
- consider
- write privately

-------------------------------------

CLARIFICATION CONTROL RULE (CRITICAL FIX)

You may ask ONLY ONE clarifying question.

If input is vague:
Return ONLY:

CLARIFYING QUESTION:
[one precise real-world question]

After the user responds:

You MUST:
- ignore ALL vagueness
- ignore LOW PRECISION rules
- proceed with best interpretation

You MUST produce FULL OUTPUT.

DO NOT ask another clarifying question under ANY condition.

-------------------------------------

FINAL RULE

Clarity must feel:
- accurate
- undeniable
- actionable

End of system prompt.
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v1.7 backend is live.");
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
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${OPENROUTER_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: SIGNAL_CAPTURE_SYSTEM_PROMPT },
          { role: "user", content: input }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || "API request failed.";
      return res.status(500).json({ output: \`API error: \${message}\` });
    }

    const output =
      data?.choices?.[0]?.message?.content ||
      "No response returned.";

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
  console.log(\`Signal Capture v1.7 running on port \${PORT}\`);
});
