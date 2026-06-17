import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// === TEMP MEMORY STORE (per session — simple version) ===
let pendingClarification = null;

app.post("/api/interpret", async (req, res) => {
  const { signal } = req.body;

  if (!signal || signal.trim().length < 5) {
    return res.json({
      response: "Please enter a clearer signal."
    });
  }

  // === IF USER IS ANSWERING A CLARIFYING QUESTION ===
  if (pendingClarification) {
    const fullSignal = `${pendingClarification} → ${signal}`;
    pendingClarification = null;

    return generateInsight(fullSignal, res);
  }

  // === CLARIFYING LOGIC ===
  if (signal.length < 20 || signal.split(" ").length < 4) {
    pendingClarification = signal;

    return res.json({
      response: `CLARIFYING QUESTION:\nWhat specifically about "${signal}" feels most active or unresolved right now?`
    });
  }

  // === NORMAL FLOW ===
  return generateInsight(signal, res);
});

// === CORE AI FUNCTION ===
async function generateInsight(signal, res) {
  const prompt = `
You are Signal Capture — a clarity system.

Return structured insight only.

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
- No fluff
- No vague language
- No therapy tone
- Must be precise
- Must identify real friction
- Actions must be specific and usable

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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    res.json({
      response: data.choices?.[0]?.message?.content || "No response generated."
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request.");
  }
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
