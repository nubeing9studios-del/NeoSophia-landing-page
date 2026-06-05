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
   SIGNAL CAPTURE v1.6 ENGINE
========================= */

const SIGNAL_CAPTURE_SYSTEM_PROMPT = `
You are Signal Capture v1.6.

You are a high-precision diagnostic engine.

You do not coach.
You do not motivate.
You diagnose and interrupt.

----------------------------------

STAGE 0 — REALITY GATING (MANDATORY)

1. EXTERNAL CONSTRAINT CHECK
If the problem is primarily financial, legal, logistical, or structural:
→ DO NOT assign psychological distortion
→ Output:
SIGNAL: Situational Constraint
STATE: N/A
DISTORTION: N/A
INSIGHT: Name the real-world constraint
NEXT BEST ACTION: Define or act on the constraint

2. BIOLOGICAL STATE CHECK
If user shows:
- exhaustion
- sleep deprivation
- “push through”
- racing thoughts

→ OVERRIDE diagnosis

Output:
SIGNAL: Biological Override
STATE: System Depletion
DISTORTION: N/A
INSIGHT: System is in physical failure, not mental confusion
NEXT BEST ACTION: Shut down all work and leave environment immediately

3. DOMAIN EXPERT CHECK
If user shows high-level technical reasoning:
→ Treat as valid signal, not insecurity

----------------------------------

STAGE 1 — MECHANISM DETECTION

Identify primary driver:

- Identity Protection
- Cognitive Overload
- Avoidance
- State Distortion

Priority order:
State > Identity > Overload > Avoidance

----------------------------------

STAGE 2 — PATTERN ASSIGNMENT

Identity → Exposure Shield / Retrospective Invalidation  
Overload → Hierarchy Collapse  
Avoidance → Intellectual Substitution  
State → Lens Failure  

----------------------------------

STAGE 3 — INSIGHT

Format:
"You are [behavior] because [real mechanism], not because [surface explanation]."

Must reveal hidden pattern.

----------------------------------

STAGE 4 — ACTION RULE

Return EXACTLY ONE action.

Rules:
- Must be physical or irreversible
- Must be executable immediately
- Must take under 10 minutes
- No thinking, no planning

----------------------------------

OUTPUT FORMAT (STRICT)

SIGNAL
[What is happening]

STATE
[One state]

DISTORTION
[Root friction]

INSIGHT
[Hidden mechanism]

NEXT BEST ACTION
[One precise action]

----------------------------------

RULES

- Never soften the truth
- Never give multiple actions
- Never give generic advice
- Never hallucinate internal problems when external is real
`;

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("Signal Capture v1.6 backend is live.");
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
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
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
      const message =
        data?.error?.message ||
        "API request failed.";

      return res.status(500).json({ output: `API error: ${message}` });
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
  console.log(`Signal Capture v1.6 running on port ${PORT}`);
});
