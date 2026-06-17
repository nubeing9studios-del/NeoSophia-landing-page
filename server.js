import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/interpret", async (req, res) => {
  const { signal } = req.body;

  if (!signal || signal.trim().length < 5) {
    return res.json({
      response: "Please enter a clearer signal."
    });
  }

  // Clarifying gate
  if (signal.length < 20 || signal.split(" ").length < 4) {
    return res.json({
      response: `CLARIFYING QUESTION:\nWhat specifically about "${signal}" feels most active or unresolved right now?`
    });
  }

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
- No vague advice
- Be precise and direct
- Identify the real friction point
- Actions must be specific and usable

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
        temperature: 0.7
      })
    });

    const data = await response.json();

    // 🔥 CRITICAL FIX
    if (!data || !data.choices || !data.choices[0]) {
      console.error("API ERROR:", data);
      return res.json({
        response: "Error generating insight. Check API key or server logs."
      });
    }

    res.json({
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.json({
      response: "Server connection issue. Try again."
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
