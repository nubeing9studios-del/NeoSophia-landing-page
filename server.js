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

  const lower = input.toLowerCase();

  let response = {
    signal: "",
    state: "",
    distortion: "",
    recognition: "",
    insight: "",
    action: []
  };

  // 🧠 CASE 1: Stuck / Overthinking
  if (lower.includes("stuck") || lower.includes("overthinking")) {
    response = {
      signal: "You are experiencing a breakdown between intention and execution, where movement is blocked despite internal clarity.",
      
      state: "Your direction is understood, but your system is overloaded, preventing you from translating thought into action.",
      
      distortion: "You are attempting to process too many possibilities at once, creating paralysis instead of progress.",
      
      recognition: "This is not a lack of ability or discipline — it is a failure of prioritisation and sequencing.",
      
      insight: "Progress is restored through reduction, not expansion. Clarity becomes stronger through action, not continued thinking.",
      
      action: [
        "Identify the ONE task that creates the most forward movement",
        "Commit to completing only that task today without switching focus",
        "Set a fixed 30–60 minute execution window",
        "After completion, write the next 3 steps before doing anything else"
      ]
    };
  }

  // 🧠 CASE 2: Low energy / tired
  else if (lower.includes("tired") || lower.includes("low energy")) {
    response = {
      signal: "Your system is signalling depletion and reduced capacity for sustained output.",
      
      state: "Mental or physical fatigue is limiting your ability to focus and execute effectively.",
      
      distortion: "You are trying to push forward without restoring energy, which reduces efficiency and clarity.",
      
      recognition: "Your system does not need more pressure — it needs recovery and recalibration.",
      
      insight: "Energy precedes clarity. Without restoring your baseline, all effort becomes inefficient.",
      
      action: [
        "Pause all active tasks for at least 10–15 minutes",
        "Hydrate and physically move your body",
        "Reduce your workload to one simple task",
        "Resume only when your energy state improves"
      ]
    };
  }

  // 🧠 DEFAULT CASE (fallback intelligence)
  else {
    response = {
      signal: `The signal detected is: "${input}" but it is not yet clearly structured.`,
      
      state: "You are experiencing internal noise without a clearly defined pattern or direction.",
      
      distortion: "Lack of clarity is creating hesitation, fragmentation, or delayed action.",
      
      recognition: "Clarity is not missing — it is unstructured and needs refinement.",
      
      insight: "You must reduce the signal into a single clear problem before meaningful action becomes possible.",
      
      action: [
        "Rewrite your input into one clear and specific sentence",
        "Identify the core tension or problem within that sentence",
        "Choose one small action that directly addresses it",
        "Execute immediately without overthinking"
      ]
    };
  }

  res.json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
