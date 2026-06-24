const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 CORE DIAGNOSTIC ENGINE
function analyzeInput(input) {
  const text = input.toLowerCase();

  let signal = "";
  let state = "";
  let distortion = "";
  let recognition = "";
  let insight = "";
  let action = "";

  // 🔸 PATTERN 1: Overthinking / Stuck
  if (text.includes("stuck") || text.includes("overthinking") || text.includes("not finishing")) {
    signal = "Avoidance of execution";
    state = "Overwhelm / cognitive overload";
    distortion = "Overthinking and trying to solve everything at once";
    recognition = "You are delaying action by expanding scope";
    insight = "Clarity comes from narrowing focus, not expanding thinking";
    action = "Choose ONE task and complete it within 30 minutes";
  }

  // 🔸 PATTERN 2: Fear / Anxiety
  else if (text.includes("scared") || text.includes("fear") || text.includes("anxious")) {
    signal = "Fear of outcome or judgment";
    state = "Anxiety state";
    distortion = "Catastrophising future outcomes";
    recognition = "You are treating a possibility as a certainty";
    insight = "Fear is a signal to move carefully, not stop completely";
    action = "Take the smallest visible step toward the task";
  }

  // 🔸 PATTERN 3: Motivation / Energy
  else if (text.includes("tired") || text.includes("no energy") || text.includes("exhausted")) {
    signal = "Energy depletion";
    state = "Fatigue";
    distortion = "Assuming low energy = inability";
    recognition = "You are interpreting state as identity";
    insight = "You don’t need motivation — you need reduced demand";
    action = "Do a 10-minute low-effort version of the task";
  }

  // 🔸 PATTERN 4: Clarity / Direction
  else if (text.includes("don’t know") || text.includes("confused") || text.includes("unclear")) {
    signal = "Lack of defined direction";
    state = "Cognitive ambiguity";
    distortion = "Trying to decide everything at once";
    recognition = "You are missing a defined next step";
    insight = "Clarity comes from defining one concrete move";
    action = "Write down the next physical action only";
  }

  // 🔸 DEFAULT (Dynamic fallback — NOT STATIC)
  else {
    signal = "Unstructured internal signal";
    state = "Mixed cognitive-emotional state";
    distortion = "Unclear pattern — requires refinement";
    recognition = "The signal is present but not yet defined clearly";
    insight = "Clarity improves when the problem is simplified further";
    action = "Rewrite your input in one clear sentence and retry";
  }

  return {
    signal,
    state,
    distortion,
    recognition,
    insight,
    action
  };
}

// 🔹 API ROUTE
app.post("/analyze", (req, res) => {
  const { input } = req.body;

  if (!input || input.trim() === "") {
    return res.json({
      error: "No input provided"
    });
  }

  const result = analyzeInput(input);

  res.json(result);
});

// 🔹 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
