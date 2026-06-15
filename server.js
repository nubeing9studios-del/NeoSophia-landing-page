const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/insight", (req, res) => {
  const { signal } = req.body;

  if (!signal || signal.trim() === "") {
    return res.json({
      type: "clarify",
      content: "CLARIFYING QUESTION: What is active for you right now?"
    });
  }

  const input = signal.toLowerCase();

  // --- CLARIFYING LOGIC (SMARTER) ---
  if (
    input.length < 8 ||
    input.includes("not sure") ||
    input.includes("idk") ||
    input.includes("confused")
  ) {
    return res.json({
      type: "clarify",
      content:
        "CLARIFYING QUESTION: What specific area of your life or situation does this relate to?"
    });
  }

  // --- INSIGHT ENGINE ---
  let response = {};

  if (input.includes("business") || input.includes("start")) {
    response = {
      signal: "Starting a new business venture",
      state: "Excitement mixed with uncertainty",
      distortion: "Overwhelm from the number of steps and unknowns ahead",
      recognition:
        "This is a transition point between security and independence",
      insight:
        "Clarity comes from breaking complexity into structured, manageable parts rather than trying to solve everything at once",
      action: `
1. Define your core idea in one sentence (what problem you solve)
2. Identify your target audience (who specifically needs this)
3. Outline a simple offer (what you provide and how)
4. Block 3–5 hours this week to work ONLY on this
5. Take one visible step (write it, name it, or test it)

Focus on movement, not perfection.
`
    };
  } else if (input.includes("stuck")) {
    response = {
      signal: "Feeling stuck",
      state: "Low clarity and reduced momentum",
      distortion: "Belief that nothing is changing or progressing",
      recognition:
        "Stuckness often signals overload or lack of clear direction",
      insight:
        "Movement returns when you reduce scope and act on something small and immediate",
      action: `
1. Identify one area causing the most friction
2. Reduce it to the smallest possible step
3. Set a 10–15 minute timer
4. Take action immediately without overthinking
5. Stop after completion — build momentum gradually

Small movement breaks stagnation.
`
    };
  } else {
    response = {
      signal: "Unstructured signal",
      state: "Unclear or undefined",
      distortion: "Lack of clarity",
      recognition: "Need to define the signal more clearly",
      insight:
        "Clarity improves when the signal is made more specific and grounded",
      action: `
1. Rewrite your signal in one clear sentence
2. Specify what area it relates to
3. Identify what outcome you want
4. Take one small step toward that outcome

Clarity comes from definition.
`
    };
  }

  return res.json({
    type: "insight",
    content: `
SIGNAL: ${response.signal}

STATE: ${response.state}

DISTORTION: ${response.distortion}

RECOGNITION: ${response.recognition}

INSIGHT: ${response.insight}

NEXT BEST ACTION:
${response.action}
`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
