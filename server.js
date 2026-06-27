const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Utility: Always guarantee valid structure
function buildResponse({
  signal,
  state,
  distortion,
  recognition,
  insight,
  nextAction
}) {
  return {
    signal,
    state,
    distortion,
    recognition,
    insight,
    nextAction: Array.isArray(nextAction) && nextAction.length > 0
      ? nextAction
      : [
          "Pause and reset your focus",
          "Reduce scope to one clear action",
          "Execute immediately without delay"
        ]
  };
}

app.post("/api/signal", (req, res) => {
  const input = (req.body.input || "").toLowerCase();

  if (!input) {
    return res.json({ error: "No input provided" });
  }

  let response;

  // 🔹 STUCK / OVERTHINKING
  if (input.includes("stuck") || input.includes("overthinking")) {
    response = buildResponse({
      signal: "Execution is blocked despite internal clarity.",
      state: "You know what needs to be done, but forward movement is not occurring.",
      distortion: "Cognitive overload is replacing structured action.",
      recognition: "This is not inability — it is a failure of sequencing.",
      insight: "Movement begins by reducing scope, not increasing effort.",
      nextAction: [
        "Select one task that creates immediate movement",
        "Commit to completing only that task",
        "Set a strict 30–60 minute execution window",
        "Block all distractions until completion"
      ]
    });
  }

  // 🔹 LOW ENERGY
  else if (input.includes("tired") || input.includes("low energy")) {
    response = buildResponse({
      signal: "You are operating in a depleted state.",
      state: "Your mental or physical energy is limiting effective action.",
      distortion: "You are trying to push instead of reset.",
      recognition: "Recovery must precede meaningful progress.",
      insight: "Energy is the foundation of clarity and execution.",
      nextAction: [
        "Pause current activity immediately",
        "Hydrate and move your body",
        "Reduce expectations to one small task",
        "Resume only when energy improves"
      ]
    });
  }

  // 🔹 CLARITY FAILURE
  else {
    response = buildResponse({
      signal: "Your input lacks structured clarity.",
      state: "There is internal noise without a clearly defined problem.",
      distortion: "Lack of definition is preventing execution.",
      recognition: "You must define the problem before solving it.",
      insight: "Clarity emerges by reducing the signal to one precise statement.",
      nextAction: [
        "Rewrite your situation in one clear sentence",
        "Identify the core issue within that sentence",
        "Choose one action that directly addresses it",
        "Execute immediately"
      ]
    });
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
