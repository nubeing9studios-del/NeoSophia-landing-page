import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

let lastSignal = null;

app.post("/api/interpret", async (req, res) => {
  const { signal } = req.body;

  if (!signal || signal.trim().length < 5) {
    return res.json({
      response: "Enter a real signal."
    });
  }

  // === HANDLE CLARIFY FLOW ===
  if (lastSignal && signal.length > 10) {
    const combined = `${lastSignal} | Clarified: ${signal}`;
    lastSignal = null;
    return generateInsight(combined, res);
  }

  // === TRIGGER CLARIFY ===
  if (signal.length < 40) {
    lastSignal = signal;

    return res.json({
      response: `CLARIFYING QUESTION:\nWhat exactly is blocking progress here — is it knowledge, structure, environment, or execution?`
    });
  }

  return generateInsight(signal, res);
});

async function generateInsight(signal, res) {
const prompt = `
You are Signal Capture — a precision execution system.

Your role is to identify the real bottleneck and force clear action.

FORMAT:

SIGNAL:
STATE:
DISTORTION:
RECOGNITION:
INSIGHT:

NEXT BEST ACTION:

1. Immediate (do now)
2. Short-term (today / this week)
3. Direction (next phase)

RULES:

- No generic advice
- No coaching tone
- No motivational language
- No corporate or consultant language
- No over-explaining

- Be sharp, direct, and specific
- Reduce everything to the core problem
- Identify ONE primary bottleneck (not multiple)

- Challenge false assumptions if needed

ACTIONS MUST:
- Be decisive and time-bound
- Remove choice, not create options
- Focus on ONE task only
- Be executable immediately

STYLE:
- Use direct commands when appropriate
- Avoid soft phrasing like "consider", "allocate", "try"
- Replace with: "do", "choose", "block", "fix"

EXAMPLES:
- "Block 60–90 minutes and fix X"
- "Choose backend. Ignore frontend until working"
- "Remove all other tasks until this is complete"
AVOID:
- “improve skills”
- “develop a plan”
- “break things down”
- “create systems”
- “review progress”

INSTEAD:
- Tell the user exactly what to do next
- Remove ambiguity completely
- Force a clear next move

Tone:
Direct. Strategic. Precise. No padding.

Signal:
"${signal}"
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    res.json({
      response: data.choices?.[0]?.message?.content || "No response generated."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "Error generating insight." });
  }
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
