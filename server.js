const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint
app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.json({ error: "No input provided" });
  }

  const text = input.toLowerCase();

  let response;

  // ✅ PHASE 3 INTELLIGENCE LAYER (CLEAN + GUARANTEED ACTION OUTPUT)

  if (text.includes("stuck") || text.includes("overthinking")) {
    response = {
      signal: "Execution is blocked despite internal clarity.",
      state: "You know what needs to be done, but forward movement is not occurring.",
      distortion: "Cognitive overload is replacing structured action.",
      recognition: "This is not inability — it is a failure of sequencing.",
      insight: "Movement begins by reducing scope, not increasing effort.",
      nextAction: [
        "Identify the ONE task that creates the most immediate movement",
        "Commit to completing only that task without switching focus",
        "Set a strict 30–60 minute execution window",
        "Block all distractions until completion"
      ]
    };
  }

  else if (text.includes("tired") || text.includes("low energy")) {
    response = {
      signal: "You are operating in a depleted state.",
      state: "Your mental or physical energy is limiting your ability to act effectively.",
      distortion: "You are trying to push through instead of resetting your system.",
      recognition: "Recovery is required before meaningful progress can occur.",
      insight: "Energy is the foundation of clarity and execution.",
      nextAction: [
        "Pause current activity immediately",
        "Hydrate and move your body",
        "Reduce expectations to one small task",
        "Resume only when energy improves"
      ]
    };
  }

  else {
    response = {
      signal: "Your input lacks structured clarity.",
      state: "There is internal noise without a clearly defined problem.",
      distortion: "Lack of clarity is preventing action.",
      recognition: "You need to define the problem before solving it.",
      insight: "Clarity comes from reducing the signal to one precise statement.",
      nextAction: [
        "Rewrite your situation in one clear sentence",
        "Identify the core issue within that sentence",
        "Choose one action that directly addresses it",
        "Execute immediately"
      ]
    };
  }

  // ✅ GUARANTEE ACTION ALWAYS EXISTS
  if (!response.nextAction || response.nextAction.length === 0) {
    response.nextAction = [
      "Pause and reset",
      "Clarify your situation",
      "Choose one small action",
      "Execute immediately"
    ];
  }

  res.json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
