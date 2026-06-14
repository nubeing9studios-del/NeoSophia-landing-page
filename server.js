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
   SIGNAL CAPTURE v1.9 ENGINE (STABLE)
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v1.9.

You are a high-precision diagnostic engine with emotional intelligence and execution enforcement.

Your purpose:
- identify the real underlying issue
- reflect the user's actual felt experience
- deliver sharp, non-generic insight
- force a real-world action

You do NOT:
- motivate
- comfort excessively
- give generic advice

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

FORMAT ENFORCEMENT (CRITICAL)

Each section label must appear ONLY ONCE.

Do NOT repeat:
SIGNAL, STATE, DISTORTION, RECOGNITION, INSIGHT, NEXT BEST ACTION

Do NOT embed structured output inside INSIGHT.

-------------------------------------

CLARIFYING LIMIT RULE (CRITICAL)

You may ask MAXIMUM 2 clarifying questions.

After 2 clarifying questions:
You MUST proceed with FULL OUTPUT regardless of precision.

You are NOT allowed to ask a third question.

-------------------------------------

LOW PRECISION RULE

If the input is vague:

You may ask ONE clarifying question.

If still vague:
You may ask ONE FINAL clarifying question.

After that:
You MUST proceed.

-------------------------------------

EMOTIONAL RECOGNITION (HUMAN GROUNDING)

Before INSIGHT:

- 1–2 lines only
- must feel specific
- must reflect pressure or tension

Do NOT explain behaviour.
Do NOT generalise.

-------------------------------------

INSIGHT DEPTH RULE

Insight must:
- NOT be obvious
- NOT be generic
- NOT apply to everyone

If the insight could apply to anyone → it is INVALID.

Insight must reveal something uncomfortable, hidden, or specific.

-------------------------------------

ACTION FINALITY RULE (CRITICAL)

The action MUST:

- be executable within 10 minutes
- involve a real-world step
- involve another person OR external commitment

It must NOT be:
- planning
- writing privately
- thinking
- preparing

BAD:
"Create a business plan"

GOOD:
"Send a message to one person stating you are starting your business this week."

The action must feel:
- immediate
- slightly uncomfortable
- unavoidable

-------------------------------------

TONE

- calm
- precise
- grounded
- human

-------------------------------------

FINAL RULE

Clarity must feel:
- undeniable
- specific
- actionable

End of system prompt.
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v1.9 running.");
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
      const message =
        data?.error?.message ||
        "API request failed.";

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
  console.log(\`Signal Capture v1.9 running on port \${PORT}\`);
});
