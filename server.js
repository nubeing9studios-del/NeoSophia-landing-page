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
    type: data.type || "full", // full OR clarify

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

// 🧠 CLARITY DETECTION
function evaluateClarity(input) {
  const wordCount = input.trim().split(/\s+/).length;

  const vaguePatterns = [
    "i feel off",
    "i don’t know",
    "i dont know",
    "something is wrong",
    "not sure",
    "confused",
    "lost"
  ];

  const isVague = vaguePatterns.some(p => input.includes(p));

  if (wordCount < 6 || isVague) return "low";
  if (wordCount < 12) return "medium";
  return "high";
}

app.post("/api/signal", (req, res) => {
  const { input, step = 0 } = req.body;

  if (!input) {
    return res.json(buildResponse({
      type: "clarify",
      anchor: "There’s nothing to process yet — I need something to work with.",
      question: "What’s the main thing you’re currently dealing with?"
    }));
  }

  const lower = input.toLowerCase();
  const clarity = evaluateClarity(lower);

  // 🔹 CLARITY GATE
  if (clarity !== "high" && step < 2) {
    return res.json(buildResponse({
      type: "clarify",
      anchor: "Something is there, but it’s not fully clear yet.",
      question: step === 0
        ? "Can you describe more specifically what’s happening?"
        : "What is the one thing within this that matters most right now?"
    }));
  }

  let response;

  // 🔹 STUCK / OVERTHINKING
  if (lower.includes("stuck") || lower.includes("overthinking")) {
    response = buildResponse({
      anchor: "It feels like you already know what needs to be done, but something is stopping you from acting.",

      signal: "You are experiencing a gap between knowing and doing. You have clarity, but it is not translating into action.",

      state: "Your mind is overloaded with competing thoughts and priorities, fragmenting your attention.",

      distortion: "You are attempting to process everything at once, which replaces structured progress with mental noise.",

      recognition: "You are not stuck due to lack of ability — you are stuck because your actions are not being sequenced clearly.",

      insight: "Progress comes from narrowing focus, not expanding effort. One clear action restores movement.",

      nextAction: [
        "Identify the ONE task that creates immediate forward movement",
        "Ignore everything else temporarily",
        "Set a strict 30–60 minute execution window",
        "Complete the task before reassessing"
      ]
    });
  }

  // 🔹 LOW ENERGY
  else if (lower.includes("tired") || lower.includes("low energy")) {
    response = buildResponse({
      anchor: "You’re trying to push forward, but your energy isn’t supporting you right now.",

      signal: "Your current state indicates depletion, reducing your ability to execute effectively.",

      state: "Your mental or physical capacity is reduced, making tasks feel heavier and slower.",

      distortion: "You are trying to push instead of recognising the need for recovery.",

      recognition: "This is not a productivity issue — it is an energy issue.",

      insight: "Restoring energy restores execution. Without it, effort becomes resistance.",

      nextAction: [
        "Stop what you are doing immediately",
        "Hydrate and move your body",
        "Reduce expectations to one very small task",
        "Resume only when energy improves"
      ]
    });
  }

  // 🔹 DEFAULT
  else {
    response = buildResponse({
      anchor: "Something is present, but it hasn’t fully formed into a clear problem yet.",

      signal: "Your situation is active but not clearly defined, limiting direction.",

      state: "You are experiencing internal noise rather than structured clarity.",

      distortion: "Lack of definition is preventing meaningful action.",

      recognition: "You cannot act clearly until the problem is clearly defined.",

      insight: "Clarity creates direction. Simplification creates clarity.",

      nextAction: [
        "Rewrite your situation in one clear sentence",
        "Identify the core issue",
        "Choose one direct action",
        "Execute immediately"
      ]
    });
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
