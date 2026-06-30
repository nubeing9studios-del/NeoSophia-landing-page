const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔒 RESPONSE BUILDER
function buildResponse(data) {
  return {
    type: data.type || "full",
    anchor: data.anchor || "",
    signal: data.signal || null,
    state: data.state || null,
    distortion: data.distortion || null,
    recognition: data.recognition || null,
    insight: data.insight || null,
    question: data.question || null,
    nextAction: Array.isArray(data.nextAction) ? data.nextAction : []
  };
}

// 🧠 CLARITY CHECK
function evaluateClarity(input) {
  const words = input.trim().split(/\s+/).length;

  if (words < 6) return "low";
  if (words < 12) return "medium";
  return "high";
}

// 💓 EMOTION DETECTION
function detectEmotion(input) {
  if (input.includes("tired") || input.includes("exhausted")) return "low_energy";
  if (input.includes("stuck") || input.includes("overthinking")) return "stuck";
  if (input.includes("lost") || input.includes("confused")) return "unclear";
  return "neutral";
}

// 🎯 RESPONSE GENERATOR
function generateResponse(input) {
  const emotion = detectEmotion(input);

  if (emotion === "stuck") {
    return buildResponse({
      anchor: "It sounds like you're caught between knowing what to do and actually doing it.",
      signal: "There is a gap between intention and action.",
      state: "Too many competing priorities are splitting your focus.",
      distortion: "Trying to process everything at once is blocking execution.",
      recognition: "You are not stuck — your actions are not sequenced clearly.",
      insight: "Progress returns when focus narrows to one clear step.",
      nextAction: [
        "Choose one task that matters most",
        "Ignore everything else temporarily",
        "Set a 30–60 minute timer",
        "Complete only that task"
      ]
    });
  }

  if (emotion === "low_energy") {
    return buildResponse({
      anchor: "It sounds like you're pushing through even though your energy is low.",
      signal: "Your energy levels are limiting effective action.",
      state: "Mental and physical capacity is reduced.",
      distortion: "You are trying to push instead of recover.",
      recognition: "This is an energy issue, not a productivity issue.",
      insight: "Restoring energy restores clarity and execution.",
      nextAction: [
        "Pause what you’re doing",
        "Hydrate and move your body",
        "Reduce to one small task",
        "Resume when energy improves"
      ]
    });
  }

  return buildResponse({
    anchor: "There’s something here, but it needs more clarity.",
    signal: "The situation is not fully defined.",
    state: "Your thoughts are present but not structured.",
    distortion: "Lack of clarity is blocking action.",
    recognition: "You need to define the problem clearly.",
    insight: "Clarity creates direction.",
    nextAction: [
      "Write the problem in one sentence",
      "Identify the core issue",
      "Choose one action",
      "Execute immediately"
    ]
  });
}

app.post("/api/signal", (req, res) => {
  const { input, step = 0 } = req.body;

  if (!input) {
    return res.json(buildResponse({
      type: "clarify",
      anchor: "I need something to work with.",
      question: "What’s the main thing you're dealing with?"
    }));
  }

  const clarity = evaluateClarity(input.toLowerCase());

  // 🔹 CLARITY GATE
  if (clarity !== "high" && step < 2) {
    return res.json(buildResponse({
      type: "clarify",
      anchor: "I can see something is there, but it’s not fully clear yet.",
      question: step === 0
        ? "Can you describe more specifically what’s happening?"
        : "What is the most important part of this right now?"
    }));
  }

  const response = generateResponse(input.toLowerCase());

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
