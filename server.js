import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Track whether user is in clarification mode
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

app.post("/generate", async (req, res) => {
  const input = req.body.input?.trim();

  if (!input) {
    return res.json({ output: "Please enter a signal." });
  }

  // 🔥 IF WAITING FOR CLARIFICATION → FORCE FULL OUTPUT
  if (awaitingClarification) {
    awaitingClarification = false;

    const response = `
SIGNAL: ${input}

STATE: Movement mixed with uncertainty

DISTORTION: Overwhelm created by multiple possible paths

RECOGNITION: Awareness that something needs to shift or evolve

INSIGHT: This is no longer a vague signal. You have now identified a direction. The tension you feel is not confusion — it is the friction between where you are and where you want to go.

NEXT BEST ACTION:
1. Define exactly what "starting your own business" means for you (type, service, or idea)
2. Identify one simple starting point (research, outline, or first action)
3. Remove all non-essential thinking — focus only on the first move
4. Commit to one action within 24 hours
5. Track progress — adjust, don't hesitate

Clarity is built through movement, not waiting.
`;

    return res.json({ output: response });
  }

  // 🔥 FIRST PASS → CHECK IF VAGUE
  if (isVague(input)) {
    awaitingClarification = true;

    return res.json({
      output: `CLARIFYING QUESTION: What specific area or situation does this relate to?`
    });
  }

  // 🔥 DIRECT CLEAR INPUT → FULL OUTPUT
  const response = `
SIGNAL: ${input}

STATE: Forward movement with underlying uncertainty

DISTORTION: Overcomplicating the path ahead

RECOGNITION: Desire to create change and take control

INSIGHT: You are not lacking clarity — you are standing at the edge of action. The signal is already strong enough to move.

NEXT BEST ACTION:
1. Break the idea into one clear starting step
2. Define a simple plan (not perfect, just usable)
3. Take immediate action within 24 hours
4. Avoid over-planning — prioritise movement
5. Review and refine as you go

Momentum creates clarity — not the other way around.
`;

  res.json({ output: response });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
