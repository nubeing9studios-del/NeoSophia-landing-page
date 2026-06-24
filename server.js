const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * 🧠 SIGNAL CLASSIFIER
 * Detects core pattern from input
 */
function classifySignal(input) {
  const text = input.toLowerCase();

  if (text.includes("start") && text.includes("finish")) {
    return "execution_gap";
  }

  if (text.includes("overwhelmed") || text.includes("too much")) {
    return "overwhelm";
  }

  if (text.includes("fear") || text.includes("scared") || text.includes("avoid")) {
    return "avoidance";
  }

  if (text.includes("perfect") || text.includes("not ready")) {
    return "perfectionism";
  }

  if (text.includes("confused") || text.includes("don't know")) {
    return "lack_of_clarity";
  }

  return "generic";
}

/**
 * 🧠 RESPONSE ENGINE
 * Generates DIFFERENT outputs per type
 */
function generateResponse(type, input) {
  const responses = {
    execution_gap: {
      signal: "Breakdown between intention and execution",
      state: "Clarity exists but is not translated into action",
      distortion: "Trying to act on too many ideas at once",
      recognition: "The issue is not effort — it's scattered focus",
      insight: "Execution requires narrowing, not expanding",
      actions: [
        "Choose ONE task only",
        "Define the smallest possible version",
        "Complete it before touching anything else"
      ]
    },

    overwhelm: {
      signal: "Cognitive overload blocking decision-making",
      state: "System overwhelmed — too many inputs",
      distortion: "Everything feels equally important",
      recognition: "Urgency is being confused with importance",
      insight: "Clarity comes from reducing input, not processing more",
      actions: [
        "Write down everything on your mind",
        "Circle ONLY what truly matters today",
        "Ignore the rest completely for now"
      ]
    },

    avoidance: {
      signal: "Avoidance of a specific uncomfortable action",
      state: "Fear-based hesitation",
      distortion: "Inflating consequences or discomfort",
      recognition: "Avoidance is masking a simple next move",
      insight: "Action reduces fear — thinking amplifies it",
      actions: [
        "Identify the exact thing you're avoiding",
        "Reduce it to a 2-minute action",
        "Do it immediately without preparation"
      ]
    },

    perfectionism: {
      signal: "Perfection blocking completion",
      state: "Readiness illusion — waiting to feel 'ready'",
      distortion: "Belief that output must be high quality before starting",
      recognition: "Perfection is delaying progress",
      insight: "Completion creates clarity — not the other way around",
      actions: [
        "Produce a rough version immediately",
        "Set a strict time limit (e.g. 30 mins)",
        "Ship it unfinished if necessary"
      ]
    },

    lack_of_clarity: {
      signal: "Undefined problem causing inaction",
      state: "Mental fog / unclear direction",
      distortion: "Trying to act without defining the problem",
      recognition: "You are solving the wrong question",
      insight: "Clarity begins with defining the real problem",
      actions: [
        "Write the problem in one sentence",
        "Ask: 'What do I actually need here?'",
        "Take one step toward answering that"
      ]
    },

    generic: {
      signal: "Unstructured input requiring clarification",
      state: "Mixed or unclear internal state",
      distortion: "Lack of defined focus",
      recognition: "Clarity has not yet been extracted",
      insight: "More precise input leads to better output",
      actions: [
        "Be more specific about what’s wrong",
        "Describe what’s blocking you clearly",
        "Run Signal Capture again"
      ]
    }
  };

  return responses[type];
}

/**
 * 🚀 API ENDPOINT
 */
app.post("/api/signal", (req, res) => {
  try {
    const { signal } = req.body;

    if (!signal || signal.trim() === "") {
      return res.status(400).json({ error: "No signal provided" });
    }

    const type = classifySignal(signal);
    const result = generateResponse(type, signal);

    res.json({
      input: signal,
      type,
      ...result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
