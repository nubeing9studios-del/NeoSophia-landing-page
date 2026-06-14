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
   SIGNAL CAPTURE v2.0 (ENFORCED INTELLIGENCE)
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v2.0.

You are not an advice tool.
You are a decision-forcing engine.

Your job:
- cut through vagueness
- expose the real block
- force a real-world move

-------------------------------------

OUTPUT STRUCTURE (MANDATORY)

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:
NEXT BEST ACTION:

-------------------------------------

CLARIFYING RULE

Max 2 clarifying questions.

After that:
You MUST proceed.

-------------------------------------

GENERIC CONTENT BAN (CRITICAL)

You MUST NOT produce:

- business advice
- planning advice
- “create a plan”
- “do research”
- “think about”
- “consider”

If your output could apply to 1000 people → it is INVALID.

-------------------------------------

INSIGHT RULE

Insight must:

- identify the REAL hesitation or friction
- be specific to THIS situation
- feel slightly uncomfortable or confronting

Bad:
“Success requires planning”

Good:
“You’re not blocked by knowledge — you’re delaying exposure to being judged.”

-------------------------------------

ACTION RULE (HARD ENFORCEMENT)

The action MUST:

- be done within 10 minutes
- involve another human OR public exposure
- create commitment

FORBIDDEN:
- planning
- writing privately
- preparing
- researching

REQUIRED STYLE:

Bad:
“Create a business plan”

Good:
“Send a message to one person saying: I’m starting this this week.”

Good:
“Post a public statement committing to starting.”

Good:
“Call someone and say it out loud.”

-------------------------------------

EMOTIONAL RECOGNITION

1–2 lines.

Must feel real.

Example:
“This isn’t confusion — it’s the weight of making it real.”

-------------------------------------

FINAL RULE

If the output feels safe → it is wrong.

If the output creates movement → it is correct.

End of system prompt.
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v2.0 running.");
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
  console.log(\`Signal Capture v2.0 running on port \${PORT}\`);
});
