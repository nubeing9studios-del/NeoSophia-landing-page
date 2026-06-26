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

  // 🧠 PHASE 3: SCORING SYSTEM
  let scores = {
    stuck: 0,
    fatigue: 0,
    confusion: 0,
    pressure: 0,
    avoidance: 0
  };

  // 🧠 SIGNAL DETECTION
  if (text.includes("stuck") || text.includes("overthinking")) scores.stuck += 2;
  if (text.includes("tired") || text.includes("low energy")) scores.fatigue += 2;
  if (text.includes("confused") || text.includes("unclear")) scores.confusion += 2;
  if (text.includes("overwhelmed") || text.includes("too much")) scores.pressure += 2;
  if (text.includes("avoid") || text.includes("procrastinating")) scores.avoidance += 2;

  // 🧠 SECONDARY SIGNAL BLENDING
  if (text.length > 120) scores.pressure += 1;
  if (text.split(" ").length < 5) scores.confusion += 1;

  // 🧠 DETERMINE DOMINANT SIGNAL
  const dominant = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const secondary = Object.keys(scores)
    .filter(k => k !== dominant)
    .sort((a, b) => scores[b] - scores[a])[0];

  // 🧠 RESPONSE BUILDER
  function buildResponse(primary, secondary) {
    let response = {};

    switch (primary) {
      case "stuck":
        response.signal = "Execution is blocked despite internal clarity.";
        response.state = "You know what needs to be done, but forward movement is not occurring.";
        response.distortion = "Cognitive overload is replacing structured action.";
        response.recognition = "This is not inability — it is a failure of sequencing.";
        response.insight = "Movement begins by reducing scope, not increasing effort.";
        response.nextAction = [
          "Identify the single highest-impact task",
          "Set a strict 30–60 minute execution window",
          "Remove all competing inputs",
          "Complete before reassessing"
        ];
        break;

      case "fatigue":
        response.signal = "Your system is operating in a depleted state.";
        response.state = "Energy levels are insufficient for effective execution.";
        response.distortion = "You are attempting output without recovery.";
        response.recognition = "Recovery is a prerequisite, not a reward.";
        response.insight = "Energy restoration creates clarity automatically.";
        response.nextAction = [
          "Pause immediately",
          "Hydrate and physically reset",
          "Lower expectations to one small task",
          "Resume only when energy improves"
        ];
        break;

      case "confusion":
        response.signal = "Your input lacks structural clarity.";
        response.state = "There is no clearly defined problem.";
        response.distortion = "Ambiguity is preventing decision-making.";
        response.recognition = "You cannot act on undefined problems.";
        response.insight = "Clarity is created through reduction.";
        response.nextAction = [
          "Rewrite the situation in one sentence",
          "Extract the core issue",
          "Define a single objective",
          "Act immediately on that objective"
        ];
        break;

      case "pressure":
        response.signal = "You are experiencing cognitive overload.";
        response.state = "Too many demands are active simultaneously.";
        response.distortion = "Everything is being treated as equally urgent.";
        response.recognition = "Not everything matters at once.";
        response.insight = "Priority is the removal of non-essential tasks.";
        response.nextAction = [
          "List everything currently active",
          "Remove or delay 50% immediately",
          "Select one priority only",
          "Execute without deviation"
        ];
        break;

      case "avoidance":
        response.signal = "You are avoiding a known action.";
        response.state = "The task is identified but not being executed.";
        response.distortion = "Resistance is being rationalised as delay.";
        response.recognition = "Avoidance signals importance, not difficulty.";
        response.insight = "Action reduces resistance instantly.";
        response.nextAction = [
          "Start the task for 5 minutes only",
          "Ignore outcome — focus on starting",
          "Build momentum through continuation",
          "Complete the first visible step"
        ];
        break;

      default:
        response.signal = input;
        response.state = "Signal not fully classified.";
        response.distortion = "Insufficient data for pattern detection.";
        response.recognition = "Clarity is required.";
        response.insight = "Refine the signal.";
        response.nextAction = [
          "Be more specific",
          "Reduce to one issue",
          "Resubmit"
        ];
    }

    // 🧠 SECONDARY INFLUENCE
    if (secondary && scores[secondary] > 0) {
      response.insight += ` Secondary influence detected: ${secondary}.`;
    }

    return response;
  }

  const result = buildResponse(dominant, secondary);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
