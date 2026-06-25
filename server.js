const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route (fixes Cannot GET /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ API endpoint
app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.json({ error: "No input provided" });
  }

  // Temporary intelligent baseline (not static anymore)
  let response;

  if (input.toLowerCase().includes("stuck") || input.toLowerCase().includes("overthinking")) {
    response = {
      signal: "Stuck between vision and execution",
      state: "Clarity present, execution blocked",
      distortion: "Over-expansion and lack of prioritisation",
      recognition: "You are not stuck — you are overloaded",
      insight: "Progress requires reduction, not addition",
      nextAction: [
        "Choose one task only",
        "Set a 30-minute execution window",
        "Complete without switching context"
      ]
    };
  } else if (input.toLowerCase().includes("tired") || input.toLowerCase().includes("low energy")) {
    response = {
      signal: "Energy depletion",
      state: "Mental or physical fatigue",
      distortion: "Trying to push without recovery",
      recognition: "Your system needs reset, not pressure",
      insight: "Energy precedes clarity",
      nextAction: [
        "Pause for 10 minutes",
        "Hydrate or move your body",
        "Return with reduced scope"
      ]
    };
  } else {
    response = {
      signal: input,
      state: "Unclassified signal",
      distortion: "Pattern not yet defined",
      recognition: "More clarity needed",
      insight: "Refine the signal for deeper accuracy",
      nextAction: [
        "Be more specific",
        "Reduce to one core problem",
        "Submit again"
      ]
    };
  }

  res.json(response);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
