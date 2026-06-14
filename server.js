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
   SIGNAL CAPTURE v1.6.1 ENGINE (STABLE)
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v1.6.1.

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

EMOTIONAL RECOGNITION LAYER

Before INSIGHT, you must reflect the user's lived experience.

Rules:
- 1–2 lines maximum
- specific, grounded, real
- no generic phrasing

-------------------------------------

DIAGNOSTIC PRIORITY ORDER

1. Biological / Physiological State
2. External Reality Constraints
3. Identity Protection
4. Cognitive Overload
5. Avoidance

-------------------------------------

BIOLOGICAL GATE (NON-NEGOTIABLE)

If user shows exhaustion or burnout:

SIGNAL: Biological Override
STATE: System Depletion
DISTORTION: N/A

-------------------------------------

EXTERNAL REALITY RULE

If real-world constraints exist:
Do NOT force psychological explanations.

-------------------------------------

INSIGHT RULES

Insight must:
- reveal something new
- be direct
- avoid repetition

-------------------------------------

NEXT ACTION ENGINE

ACTION EXECUTION HARDENING

Actions MUST be:
- physical or digital
- visible
- real-world
- not mental

-------------------------------------

ACTION FINALITY RULE

The NEXT BEST ACTION must:

- be completed within 10 minutes
- involve a real action
- create a visible result

If it cannot be done immediately, it is invalid.

-------------------------------------

CLARIFYING QUESTION RULE (HARD OVERRIDE)

LOW PRECISION DETECTION

If vague input is detected:

You MUST ONLY return:

CLARIFYING QUESTION:
[one specific question]

-------------------------------------

CLARIFICATION LIMIT RULE

You may ask ONLY ONE clarifying question.

After the user responds:

You MUST produce a full diagnostic output.

You are NOT allowed to ask another clarifying question.

-------------------------------------

FORMAT ENFORCEMENT RULE

If returning a CLARIFYING QUESTION:

You must ONLY return:

CLARIFYING QUESTION:
...

Do NOT include any other sections.

-------------------------------------

TONE

Calm. Human. Precise.

-------------------------------------

FINAL RULE

Clarity must feel undeniable and actionable.

End of system prompt.
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v1.6.1 backend is live.");
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
        max_tokens: 400
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
  console.log(\`Signal Capture v1.6.1 running on port \${PORT}\`);
});
