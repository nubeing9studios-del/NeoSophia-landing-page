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

// 💓 EMOTIONAL DETECTION
function detectEmotion(input) {
  if (input.includes("tired") || input.includes("exhausted")) return "low_energy";
  if (input.includes("stuck") || input.includes("overthinking")) return "stuck";
  if (input.includes("lost") || input.includes("confused")) return "unclear";
  return "neutral";
}

// 🎯 ADAPTIVE RESPONSE GENERATOR
function generateAdaptiveResponse(input) {
  const lower = input.toLowerCase();
  const emotion = detectEmotion(lower);

  // 🔹 STUCK
  if (emotion === "stuck") {
    return buildResponse({
      anchor: "It feels like you're caught between knowing what to do and actually doing it — that tension can be frustrating.",

      signal: "You are experiencing a gap between knowing and doing. You already have a sense of what needs to happen, but action is not following.",

      state: "Your mind is holding multiple priorities at once, which is pulling your attention in different directions instead of allowing focus.",

      distortion: "Instead of moving step-by-step, your system is trying to process everything at once. This creates friction and stalls progress.",

      recognition: "This isn’t about ability. You’re not stuck because you can’t act — you’re stuck because your actions aren’t being clearly sequenced.",

      insight: "Progress returns when you reduce the field of focus. One clear action is more powerful than ten competing ones.",

      nextAction: [
        "Identify the ONE task that creates the most immediate forward movement",
        "Ignore everything else temporarily — even if it feels important",
        "Set a strict 30–60 minute execution window",
        "Complete that task fully before reassessing anything else"
      ]
    });
  }

  // 🔹 LOW ENERGY
  if (emotion === "low_energy") {
    return buildResponse({
      anchor: "It sounds like you're pushing yourself even though your energy isn’t really there — that can quietly drain you further.",

      signal: "Your current state suggests depletion. You are trying to operate, but your energy levels are not supporting effective action.",

      state: "Your mental and physical capacity is reduced, making even simple tasks feel heavier and slower to begin.",

      distortion: "Instead of recognising the need to recover, your system is trying to push forward, which creates resistance.",

      recognition: "This isn’t a productivity problem — it’s an energy management problem. Without recovery, output will continue to degrade.",

      insight: "Energy is the foundation of execution. When energy is restored, clarity and action naturally follow.",

      nextAction: [
        "Stop what you are doing — even briefly",
        "Drink water and physically move your body (even lightly)",
        "Reduce your expectation to one very small, manageable task",
        "Only return to full effort once your energy noticeably improves"
      ]
    });
  }

  // 🔹 UNCLEAR
  if (emotion === "unclear") {
    return buildResponse({
      anchor: "It sounds like something is off, but it hasn’t fully taken shape yet — that can feel unsettling.",

      signal: "What you’re experiencing is real, but it hasn’t yet formed into a clearly defined problem.",

      state: "You are dealing with internal noise rather than a structured issue, so your thoughts feel present but not organised.",

      distortion: "Because the problem isn’t clearly defined, your system can’t generate a clear path forward.",

      recognition: "You can’t act effectively until you define exactly what you’re dealing with.",

      insight: "Clarity is created through simplification. When you reduce everything to one precise statement, direction appears.",

      nextAction: [
        "Write your situation in one single, clear sentence",
        "Identify the one core issue within that sentence",
        "Choose one action that directly addresses it",
        "Take that action immediately without adding complexity"
      ]
    });
  }

  // 🔹 DEFAULT
  return buildResponse({
    anchor: "There’s something here worth exploring, even if it’s not fully clear yet.",

    signal: "Your input contains movement, but it lacks full definition.",

    state: "You are holding multiple thoughts without a structured direction.",

    distortion: "Lack of clarity is limiting effective action.",

    recognition: "Defining the problem clearly is the first step toward solving it.",

    insight: "Clarity creates momentum. Precision creates execution.",

    nextAction: [
      "Define the problem in one clear sentence",
      "Strip away anything non-essential",
      "Choose one direct action",
      "Execute immediately"
    ]
  });
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

  const clarity = evaluateClarity(input.toLowerCase());

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

  // 🔹 ADAPTIVE RESPONSE
  const response = generateAdaptiveResponse(input);

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
