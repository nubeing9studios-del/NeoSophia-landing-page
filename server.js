const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔒 GUARANTEED RESPONSE BUILDER (WITH HUMAN LAYER)
function buildResponse(data) {
  return {
    anchor: data.anchor || "Something in your current situation is active, but not yet fully clear.",

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
      anchor: "There’s nothing to process yet — no signal has been provided.",

      signal: "No signal provided",

      state: "No input detected",

      distortion: "Missing input",

      recognition: "The system cannot respond without something to work with.",

      insight: "Clarity begins with expression. Start by describing what’s happening."
    }));
  }

  const lower = input.toLowerCase();

  let response;

  // 🔹 STUCK / OVERTHINKING
  if (lower.includes("stuck") || lower.includes("overthinking")) {
    response = buildResponse({
      anchor: "It feels like you already know what needs to be done, but something is stopping you from actually starting or following through.",

      signal: "You are experiencing a gap between knowing and doing. You already have a sense of what needs to happen, but you are not translating that into action.",

      state: "Your mind is overloaded with competing thoughts and priorities. Instead of focusing, your attention is being pulled in multiple directions at once.",

      distortion: "Your system is attempting to process everything simultaneously. This creates friction, which replaces structured progress with mental noise.",

      recognition: "You are not stuck because you lack ability. You are stuck because your actions are not being sequenced or prioritised clearly.",

      insight: "Progress does not come from doing more. It comes from narrowing your focus to one clear, executable step.",

      nextAction: [
        "Identify the ONE task that creates the most immediate forward movement",
        "Ignore everything else temporarily",
        "Set a strict 30–60 minute execution window",
        "Complete the task before reassessing anything else"
      ]
    });
  }

  // 🔹 LOW ENERGY
  else if (lower.includes("tired") || lower.includes("low energy")) {
    response = buildResponse({
      anchor: "It feels like you’re trying to keep going, but your system doesn’t have the energy to support it right now.",

      signal: "Your current state suggests depletion. You are trying to operate, but your energy levels are not supporting effective action.",

      state: "Your mental or physical capacity is reduced. Tasks feel heavier, slower, and harder to initiate.",

      distortion: "Instead of recognising the need for recovery, your system is trying to push forward. This creates resistance rather than progress.",

      recognition: "This is not a productivity issue. It is an energy management issue. Without recovery, output will continue to degrade.",

      insight: "Energy is the base layer of all execution. Restoring your state will naturally restore your ability to act.",

      nextAction: [
        "Stop what you are doing immediately",
        "Drink water and physically move your body",
        "Lower expectations to one very small task",
        "Resume only when your energy improves"
      ]
    });
  }

  // 🔹 DEFAULT (LACK OF CLARITY)
  else {
    response = buildResponse({
      anchor: "Something is present in your thinking, but it hasn’t fully formed into a clear problem yet.",

      signal: "What you have expressed is active, but not yet clearly defined. There is movement in your thinking, but no precise direction.",

      state: "You are dealing with internal noise rather than a clearly structured problem. Your thoughts exist, but they are not organised.",

      distortion: "Because the problem is not clearly defined, your system cannot produce a clear solution. This creates hesitation and inaction.",

      recognition: "You cannot act effectively until you define exactly what you are dealing with.",

      insight: "Clarity is created by simplifying. When you reduce your situation to one precise statement, direction becomes available.",

      nextAction: [
        "Rewrite your situation in one clear sentence",
        "Identify the single core issue within it",
        "Choose one action that directly addresses that issue",
        "Execute immediately without adding complexity"
      ]
    });
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
