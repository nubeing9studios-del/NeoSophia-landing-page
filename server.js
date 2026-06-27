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
    signal: data.signal,
    state: data.state,
    distortion: data.distortion,
    recognition: data.recognition,
    insight: data.insight,
    nextAction: Array.isArray(data.nextAction) && data.nextAction.length > 0
      ? data.nextAction
      : [
          "Identify one clear next step",
          "Commit to executing it immediately",
          "Avoid distractions",
          "Complete before reassessing"
        ]
  };
}

app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.json(buildResponse({
      signal: "No signal provided. You have not entered anything the system can interpret.",
      state: "There is no active input to process, so no meaningful interpretation can occur.",
      distortion: "Without input, the system cannot distinguish between signal and noise.",
      recognition: "You need to provide a clear thought, tension, or question.",
      insight: "Clarity begins with expression. Once you define something, it becomes workable."
    }));
  }

  const lower = input.toLowerCase();

  let response;

  // 🔥 OVERLOAD / STUCK
  if (lower.includes("stuck") || lower.includes("overthinking")) {
    response = buildResponse({
      signal: "Execution is blocked despite internal clarity. You likely already know what needs to be done, but you are not moving forward.",
      
      state: "You are mentally overloaded. Too many thoughts, tasks, or priorities are competing for your attention at once.",
      
      distortion: "Cognitive overload is replacing structured action. Instead of progressing step by step, your system is trying to process everything simultaneously.",
      
      recognition: "This is not a capability issue — it is a sequencing issue. You are not stuck because you cannot act, but because your actions are not being prioritised properly.",
      
      insight: "Movement begins by reducing scope, not increasing effort. Progress will return when you focus on one clear, executable step.",
      
      nextAction: [
        "Identify the ONE task that creates the most immediate forward movement",
        "Commit to completing only that task",
        "Set a strict 30–60 minute execution window",
        "Block all distractions until completion"
      ]
    });
  }

  // 🔥 LOW ENERGY
  else if (lower.includes("tired") || lower.includes("low energy")) {
    response = buildResponse({
      signal: "You are operating in a depleted state. Your energy levels are currently too low to support effective execution.",
      
      state: "Your mental or physical energy is limiting your ability to act. Tasks feel heavier and harder to initiate than usual.",
      
      distortion: "You are trying to push through instead of resetting your system. This creates resistance rather than progress.",
      
      recognition: "Recovery is required before meaningful progress can occur. Action without energy will continue to feel forced.",
      
      insight: "Energy is the foundation of clarity and execution. Restoring your state will naturally improve your ability to act.",
      
      nextAction: [
        "Pause your current activity immediately",
        "Hydrate and move your body",
        "Reduce expectations to one small task",
        "Resume only when your energy improves"
      ]
    });
  }

  // 🔥 DEFAULT (CLARITY)
  else {
    response = buildResponse({
      signal: "Your input lacks structured clarity. The situation is not yet clearly defined.",
      
      state: "There is internal noise without a clearly defined problem. Your thoughts are active but not organised.",
      
      distortion: "Lack of clarity is preventing action. Without a clear problem, your system cannot produce a clear solution.",
      
      recognition: "You must define the problem before solving it. Action requires a precise starting point.",
      
      insight: "Clarity comes from reducing the signal to one precise statement. Simplicity creates direction.",
      
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
