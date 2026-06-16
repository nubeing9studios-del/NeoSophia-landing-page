import express from "express";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/interpret", async (req, res) => {
  const { signal } = req.body;

  // =========================
  // BASIC VALIDATION
  // =========================
  if (!signal || signal.trim().length < 5) {
    return res.json({
      response: "Please enter a clearer signal."
    });
  }

  // =========================
  // CLARIFYING LOGIC (IMPROVED)
  // =========================
  if (signal.length < 15 || signal.split(" ").length < 3) {
    return res.json({
      response: `CLARIFYING QUESTION:
What specifically about "${signal}" feels most active or unresolved right now?`
    });
  }

  // =========================
  // PROMPT
  // =========================
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

FINAL:
End with ONE follow-up question that deepens clarity.

RULES:
- No fluff
- No vague language
- No therapy tone
- No generic advice
- Must reflect the user’s real situation
- Must identify the real friction point
- Actions must be specific, realistic, usable
- Speak like a strategist, not a coach

Signal:
"${signal}"
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6
      })
    });

    const data = await response.json();

    // =========================
    // SAFETY CHECK
    // =========================
    const reply =
      data?.choices?.[0]?.message?.content ||
      "No response generated.";

    res.json({
      response: reply
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      response: "Error processing request."
    });
  }
});

// =========================
// SERVER START
// =========================

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
