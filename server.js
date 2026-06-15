import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Serve ALL files from root
app.use(express.static("."));

// 🧠 Clarification state
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

app.post("/generate", (req, res) => {
  const input = req.body.input?.trim();

  if (!input) {
    return res.json({ output: "Please enter a signal." });
  }

  if (awaitingClarification) {
    awaitingClarification = false;

    return res.json({
      output: `
SIGNAL: ${input}

STATE: Movement mixed with uncertainty

DISTORTION: Overwhelm from too many paths

RECOGNITION: You are ready for change

INSIGHT: You now have direction. The hesitation is not confusion — it is the moment before action.

NEXT BEST ACTION:
1. Define exactly what this means (be specific)
2. Choose ONE simple starting step
3. Ignore everything else
4. Take action within 24 hours
5. Adjust after movement

Clarity follows action.
`
    });
  }

  if (isVague(input)) {
    awaitingClarification = true;

    return res.json({
      output: "CLARIFYING QUESTION: What specific area or situation does this relate to?"
    });
  }

  return res.json({
    output: `
SIGNAL: ${input}

STATE: Forward movement with uncertainty

DISTORTION: Overthinking the path

RECOGNITION: Desire for change

INSIGHT: You are already at the point of action.

NEXT BEST ACTION:
1. Break this into one clear step
2. Act within 24 hours
3. Avoid overplanning
4. Learn through execution
5. Adjust as needed

Momentum creates clarity.
`
  });
});

// 🔥 ROOT FIX (CRITICAL)
app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
