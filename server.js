import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Serve frontend files
app.use(express.static("public"));

// 🧠 Track clarification state
let awaitingClarification = false;

const isVague = (input) => {
  const vaguePatterns = [
    "stuck",
    "confused",
    "overwhelmed",
    "not sure",
    "don't know",
    "dont know",
    "lost",
    "uncertain"
  ];

  const shortInput = input.split(" ").length <= 4;

  return (
    shortInput ||
    vaguePatterns.some(word => input.toLowerCase().includes(word))
  );
};

// 🔥 MAIN API
app.post("/generate", async (req, res) => {
  const input = req.body.input?.trim();

  if (!input) {
    return res.json({ output: "Please enter a signal." });
  }

  // 🔁 IF CLARIFICATION RESPONSE
  if (awaitingClarification) {
    awaitingClarification = false;

    return res.json({
      output: `
SIGNAL: ${input}

STATE: Movement mixed with uncertainty

DISTORTION: Overwhelm created by multiple possible paths

RECOGNITION: Awareness that something needs to shift

INSIGHT: You now have direction. The issue is not confusion — it is hesitation at the edge of action.

NEXT BEST ACTION:
1. Define what "starting your business" actually is (offer, service, or idea)
2. Choose ONE simple first step (research, outline, or test)
3. Remove all unnecessary thinking
4. Take action within 24 hours
5. Track progress and adjust

Clarity comes from movement.
`
    });
  }

  // ❓ IF VAGUE INPUT
  if (isVague(input)) {
    awaitingClarification = true;

    return res.json({
      output: "CLARIFYING QUESTION: What specific area or situation does this relate to?"
    });
  }

  // ✅ CLEAR INPUT
  return res.json({
    output: `
SIGNAL: ${input}

STATE: Forward movement with uncertainty

DISTORTION: Overcomplicating the path

RECOGNITION: Desire for change

INSIGHT: You are already at the point of action. The next step is not more thinking — it is movement.

NEXT BEST ACTION:
1. Break this into one clear first step
2. Take action within 24 hours
3. Avoid overplanning
4. Learn through execution
5. Adjust based on results

Momentum creates clarity.
`
  });
});

// 🔥 ROOT ROUTE FIX
app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// 🔥 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
