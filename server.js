const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔒 GUARANTEED RESPONSE BUILDER
function buildResponse(data) {
  return {
    signal: data.signal || "Signal not defined",
    state: data.state || "State not defined",
    distortion: data.distortion || "Distortion not defined",
    recognition: data.recognition || "Recognition not defined",
    insight: data.insight || "Insight not defined",
    nextAction: Array.isArray(data.nextAction) && data.nextAction.length > 0
      ? data.nextAction
      : [
          "Identify one clear next step",
          "Commit to executing it immediately",
          "Avoid adding new inputs or distractions",
          "Complete before reassessing"
        ]
  };
}

app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.json(buildResponse({
      signal: "No signal provided",
      state: "No input detected",
      distortion: "Missing input",
      recognition: "System requires a signal to process",
      insight: "Clarity begins with input"
    }));
  }

  const lower = input.toLowerCase();

  let response;

  if (lower.includes("stuck") || lower.includes("overthinking")) {
    response = buildResponse({
      signal: "Execution is blocked despite internal clarity.",
      state: "You know what needs to be done, but forward movement is not occurring.",
      distortion: "Cognitive overload is replacing structured action.",
      recognition: "This is not inability — it is a failure of sequencing.",
      insight: "Movement begins by reducing scope, not increasing effort.",
      nextAction: [
        "Identify the ONE task that creates the most forward movement",
        "Commit to completing only that task",
        "Set a strict 30–60 minute execution window",
        "Block all distractions until completion"
      ]
    });
  }

  else if (lower.includes("tired") || lower.includes("low energy")) {
    response = buildResponse({
      signal: "You are operating in a depleted state.",
      state: "Your mental or physical energy is limiting execution.",
      distortion: "You are trying to push instead of resetting.",
      recognition: "Recovery must occur before meaningful progress.",
      insight: "Energy is the foundation of clarity and action.",
      nextAction: [
        "Pause current activity immediately",
        "Hydrate and move your body",
        "Reduce expectations to one small task",
        "Resume only when energy improves"
      ]
    });
  }

  else {
    response = buildResponse({
      signal: "Your input lacks structured clarity.",
      state: "There is internal noise without a defined problem.",
      distortion: "Lack of clarity is preventing action.",
      recognition: "You must define the problem before solving it.",
      insight: "Clarity comes from reducing the signal to one precise statement.",
      nextAction: [
        "Rewrite your situation in one clear sentence",
        "Identify the core issue within it",
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
