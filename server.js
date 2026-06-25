const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input) {
    return res.json({ error: "No input provided" });
  }

  const text = input.toLowerCase();

  // 🧠 SIGNAL SCORING SYSTEM
  let scores = {
    stuck: 0,
    fatigue: 0,
    unclear: 0
  };

  // 🔍 Pattern detection
  if (text.includes("stuck") || text.includes("overthinking") || text.includes("can't move")) {
    scores.stuck += 2;
  }

  if (text.includes("tired") || text.includes("low energy") || text.includes("burnout")) {
    scores.fatigue += 2;
  }

  if (text.length < 25 || text.includes("not sure") || text.includes("confused")) {
    scores.unclear += 1;
  }

  // 🧠 Determine dominant signal
  const dominant = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  // 🎲 Variation engine (prevents repetition)
  const variations = {
    stuck: [
      "You are caught between intention and execution.",
      "There is a gap between what you know and what you are doing.",
      "Movement is blocked despite internal clarity."
    ],
    fatigue: [
      "Your system is running below optimal energy.",
      "You are operating in a depleted state.",
      "Your capacity is reduced due to fatigue."
    ],
    unclear: [
      "The signal is not yet clearly defined.",
      "Your input lacks structured clarity.",
      "The core issue is still forming."
    ]
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let response = {
    signal: "",
    state: "",
    distortion: "",
    recognition: "",
    insight: "",
    action: []
  };

  // 🧠 INTELLIGENCE LOGIC

  if (dominant === "stuck") {
    response.signal = pick(variations.stuck);

    response.state = "You understand what needs to be done, but your system is overloaded or unfocused.";

    response.distortion = "Too many competing thoughts are creating paralysis instead of execution.";

    response.recognition = "The issue is not capability — it is prioritisation and sequencing.";

    response.insight = "Progress is created by narrowing focus, not expanding effort.";

    response.action = [
      "Select one task that creates the most immediate movement",
      "Commit to completing only that task",
      "Set a strict execution window (30–60 minutes)",
      "Block all distractions until completion"
    ];
  }

  else if (dominant === "fatigue") {
    response.signal = pick(variations.fatigue);

    response.state = "Your mental or physical energy is limiting your ability to act effectively.";

    response.distortion = "You are trying to push through instead of resetting your system.";

    response.recognition = "Recovery is required before meaningful progress can occur.";

    response.insight = "Energy is the foundation of clarity and execution.";

    response.action = [
      "Pause current activity immediately",
      "Hydrate and move your body",
      "Reduce expectations to one small task",
      "Resume only when energy improves"
    ];
  }

  else {
    response.signal = pick(variations.unclear);

    response.state = "There is internal noise without a clearly defined problem.";

    response.distortion = "Lack of clarity is preventing action.";

    response.recognition = "You need to define the problem before solving it.";

    response.insight = "Clarity comes from reducing the signal to one precise statement.";

    response.action = [
      "Rewrite your situation in one clear sentence",
      "Identify the core issue within that sentence",
      "Choose one action that directly addresses it",
      "Execute immediately"
    ];
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
