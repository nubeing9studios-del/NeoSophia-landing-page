const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ===============================
// 🧠 INTELLIGENCE LAYER (PHASE 7.5)
// ===============================

// 🔍 INTERPRET SIGNAL (not just emotion)
function interpretSignal(input) {
  const lower = input.toLowerCase();

  let theme = "unclear";
  let clarity = "low";
  let intensity = "medium";

  if (lower.includes("overthinking") || lower.includes("too many ideas")) {
    theme = "overload";
    clarity = "medium";
  }

  if (lower.includes("stuck") || lower.includes("can't move")) {
    theme = "execution_block";
    clarity = "high";
  }

  if (lower.includes("tired") || lower.includes("exhausted")) {
    theme = "low_energy";
    intensity = "high";
  }

  if (lower.includes("lost") || lower.includes("don't know why")) {
    theme = "direction_loss";
    clarity = "low";
  }

  return { theme, clarity, intensity };
}


// 🧱 BUILD HUMAN RESPONSE (DEPTH LAYER)
function buildResponseBlock(type, theme) {
  const blocks = {

    signal: {
      overload: "You are experiencing a state where your thinking has become crowded and overloaded. Multiple ideas or priorities are competing for attention, making it difficult to focus clearly on any one direction.",
      execution_block: "You already have a level of internal clarity about what needs to happen, but there is a gap between that awareness and taking action.",
      low_energy: "Your current signal reflects depletion. You are attempting to operate, but your available energy is not supporting effective execution.",
      direction_loss: "What you’ve expressed shows movement in your thinking, but it hasn’t yet formed into a clearly defined direction.",
      unclear: "There is something active in your thinking, but it hasn’t yet been clearly structured or defined."
    },

    state: {
      overload: "Your mind is processing too many inputs at once. Instead of focusing, your attention is being spread across multiple competing thoughts or possibilities.",
      execution_block: "You are mentally aware of what needs to be done, but your system is not translating that into structured action.",
      low_energy: "Your mental or physical capacity is currently reduced. Tasks may feel heavier, slower, or harder to initiate.",
      direction_loss: "You are dealing with internal noise rather than a clearly structured problem. Thoughts are present, but not organised.",
      unclear: "Your thoughts exist, but they are not yet structured into a clear or actionable form."
    },

    distortion: {
      overload: "Your system is attempting to process everything simultaneously, which replaces structured progress with friction and mental noise.",
      execution_block: "Instead of sequencing actions step-by-step, your system is holding everything at once, preventing forward movement.",
      low_energy: "Instead of recognising the need for recovery, your system is trying to push forward, which creates resistance rather than progress.",
      direction_loss: "Because the problem is not clearly defined, your system cannot generate a precise or confident solution.",
      unclear: "Lack of clarity is preventing your system from forming a clear path forward."
    },

    recognition: {
      overload: "This is not a capability issue — it is a focus and prioritisation issue.",
      execution_block: "You are not stuck because you lack ability — you are stuck because your actions are not being sequenced clearly.",
      low_energy: "This is not a productivity issue — it is an energy management issue.",
      direction_loss: "You cannot act effectively until you define exactly what you are dealing with.",
      unclear: "Before progress can happen, clarity must be created."
    },

    insight: {
      overload: "Progress will return when you reduce your scope and focus on one clear direction.",
      execution_block: "Movement begins when you reduce complexity and act on a single defined step.",
      low_energy: "Restoring your energy will naturally restore your ability to think clearly and act effectively.",
      direction_loss: "Clarity creates direction. Simplifying your situation will unlock movement.",
      unclear: "Clarity is the starting point of all meaningful action."
    },

    action: {
      overload: [
        "Select the ONE idea or task that matters most right now",
        "Temporarily ignore all other options",
        "Set a focused 30–60 minute execution window",
        "Complete that step before reviewing anything else"
      ],
      execution_block: [
        "Identify the next immediate action (not the whole plan)",
        "Commit to completing only that step",
        "Remove all distractions during execution",
        "Finish before reassessing"
      ],
      low_energy: [
        "Pause what you are currently doing",
        "Hydrate and physically reset your body",
        "Reduce expectations to one small, manageable task",
        "Resume only when your energy begins to recover"
      ],
      direction_loss: [
        "Write your situation in one clear sentence",
        "Identify the single core issue within it",
        "Choose one action that directly addresses that issue",
        "Execute immediately without adding complexity"
      ],
      unclear: [
        "Describe your situation more specifically",
        "Reduce it to one clear statement",
        "Identify what actually needs to change",
        "Take one immediate step forward"
      ]
    }
  };

  return blocks[type][theme];
}


// 🧠 MAIN RESPONSE ENGINE
function generateResponse(input) {
  const interpretation = interpretSignal(input);

  return {
    signal: buildResponseBlock("signal", interpretation.theme),
    state: buildResponseBlock("state", interpretation.theme),
    distortion: buildResponseBlock("distortion", interpretation.theme),
    recognition: buildResponseBlock("recognition", interpretation.theme),
    insight: buildResponseBlock("insight", interpretation.theme),
    nextAction: buildResponseBlock("action", interpretation.theme)
  };
}


// ===============================
// 🚀 API
// ===============================

app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  if (!input || input.trim().length < 5) {
    return res.json({
      needsClarification: true,
      message: "I can see something is there, but I need a bit more detail to guide you properly. Can you expand on what’s happening?"
    });
  }

  const response = generateResponse(input);

  res.json({
    needsClarification: false,
    ...response
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
