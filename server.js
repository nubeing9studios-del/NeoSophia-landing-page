import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

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

app.post("/generate", async (req, res) => {
  const input = req.body.input?.trim();

  if (!input) {
    return res.json({ output: "Please enter a signal." });
  }

  // 🔥 CLARIFICATION LOGIC
  if (isVague(input)) {
    return res.json({
      output: `CLARIFYING QUESTION: What specific area or situation does this relate to?`
    });
  }

  // 🔥 FULL OUTPUT (ONLY WHEN CLEAR)
  const response = `
SIGNAL: ${input}

STATE: Movement mixed with uncertainty

DISTORTION: Overwhelm created by multiple possible paths

RECOGNITION: Awareness that something needs to shift or evolve

INSIGHT: This moment is not confusion — it is a threshold. The presence of tension indicates direction trying to form, but it has not yet been defined clearly enough to act with confidence.

NEXT BEST ACTION:
1. Define the exact outcome you want (be specific — what does success look like here?)
2. Identify the smallest possible starting point (not the full plan, just the entry step)
3. Remove everything that is not required for that first step
4. Take one controlled action within the next 24 hours
5. Review the result — adjust, not overthink

The goal is not to solve everything — it is to restore movement.
`;

  res.json({ output: response });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
