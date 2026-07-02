// ===============================
// SYSTEM GOVERNANCE RULES
// ===============================
/*
1. This file is built in layers.
2. Core Engine must NOT be modified unless broken.
3. Each phase ONLY modifies its designated layer.
4. No full file rewrites after this version.
5. All improvements must be additive or targeted replacements.
*/


// ===============================
// CORE ENGINE (LOCKED)
// ===============================

function classifySignal(input) {
  const text = input.toLowerCase();

  if (text.includes("tired") || text.includes("exhausted")) return "low_energy";
  if (text.includes("overthinking") || text.includes("too many")) return "overload";
  if (text.includes("stuck") || text.includes("not doing")) return "execution_block";
  if (text.includes("lost") || text.includes("not sure")) return "direction_loss";

  return "unclear";
}


// ===============================
// CLARITY GATE (PHASE 6.5)
// ===============================

function needsClarity(input) {
  return input.split(" ").length < 6;
}

function getClarifyingQuestion() {
  return "I can see something is there, but it’s not fully clear yet. Can you describe more specifically what’s happening?";
}


// ===============================
// ADAPTIVE LAYER (PHASE 7)
// ===============================

function getTone(type) {
  if (type === "low_energy") return "slow";
  if (type === "overload") return "focused";
  return "neutral";
}


// ===============================
// RESPONSE LIBRARY (PHASE 7.5 + 7.6)
// ===============================

const responses = {

  overload: {
    anchor: "There’s a lot happening in your mind right now — let’s slow it down and bring it into focus.",

    signal: [
      "You’re experiencing a state where your thinking has become crowded and overloaded.",
      "Multiple ideas or priorities are competing for your attention at the same time.",
      "This is making it difficult to focus clearly on any one direction."
    ],

    state: [
      "Your mind is trying to process too many inputs simultaneously.",
      "Instead of clarity, your attention is being pulled in multiple directions.",
      "That fragmentation is what’s creating the sense of overwhelm."
    ],

    distortion: [
      "Your system is attempting to handle everything at once.",
      "That replaces structured progress with friction and mental noise.",
      "The more you try to hold, the less clearly you can move."
    ],

    recognition: [
      "This is not a capability issue.",
      "It’s a focus and prioritisation issue.",
      "Your ability is intact — it just needs direction."
    ],

    insight: [
      "Progress returns when you reduce scope.",
      "Clarity emerges when you choose one direction over many.",
      "You don’t need more ideas — you need selection."
    ],

    action: [
      "Select the ONE idea or task that matters most right now",
      "Temporarily ignore all other options",
      "Set a focused 30–60 minute execution window",
      "Complete that step before reviewing anything else"
    ]
  },


  low_energy: {
    anchor: "Your system isn’t resisting — it’s asking for something different right now.",

    signal: [
      "Your current state reflects depletion rather than resistance.",
      "You are trying to operate, but your available energy is not supporting effective execution.",
      "That mismatch is what’s creating friction."
    ],

    state: [
      "Your mental or physical capacity is currently reduced.",
      "Tasks feel heavier, slower, and harder to initiate.",
      "This is a state issue, not a discipline issue."
    ],

    distortion: [
      "Instead of recognising the need for recovery, your system is trying to push forward.",
      "That creates resistance instead of progress.",
      "The more you push, the less effective you become."
    ],

    recognition: [
      "This is not a productivity problem.",
      "It is an energy management issue.",
      "Without recovery, output will continue to degrade."
    ],

    insight: [
      "Energy is the base layer of all execution.",
      "When energy improves, clarity and action follow naturally.",
      "Restoring state restores performance."
    ],

    action: [
      "Pause what you are currently doing",
      "Hydrate and physically reset your body",
      "Reduce expectations to one small, manageable task",
      "Resume only when your energy begins to recover"
    ]
  },


  execution_block: {
    anchor: "You already know more than you think — we just need to unlock movement.",

    signal: [
      "There is a gap between knowing and doing in your current state.",
      "You already have a sense of what needs to happen.",
      "But that knowledge is not being translated into action."
    ],

    state: [
      "Your thinking is active, but not aligned with execution.",
      "You may be hesitating, delaying, or over-processing.",
      "This creates a loop without movement."
    ],

    distortion: [
      "The system believes more thinking will solve the issue.",
      "But the issue is not lack of clarity — it’s lack of execution.",
      "Overthinking replaces action with delay."
    ],

    recognition: [
      "You are not stuck because you don’t know what to do.",
      "You are stuck because action is not being initiated.",
      "Movement, not thinking, is the missing piece."
    ],

    insight: [
      "Clarity deepens through action, not before it.",
      "Starting imperfectly is more powerful than waiting for certainty.",
      "Execution breaks the loop."
    ],

    action: [
      "Identify the smallest actionable step you can take right now",
      "Commit to starting without overthinking",
      "Set a strict short execution window",
      "Complete the step before reassessing"
    ]
  },


  direction_loss: {
    anchor: "You’re not lost — something just hasn’t fully formed yet.",

    signal: [
      "What you’ve expressed shows movement in your thinking.",
      "But it hasn’t yet formed into a clearly defined direction.",
      "There is activity without alignment."
    ],

    state: [
      "Your thoughts exist, but they are not structured.",
      "You are dealing with internal noise rather than a defined problem.",
      "That lack of structure is creating hesitation."
    ],

    distortion: [
      "Because the problem isn’t clearly defined, your system can’t produce a clear path forward.",
      "This leads to uncertainty and inaction.",
      "Without definition, direction cannot emerge."
    ],

    recognition: [
      "You cannot act effectively until you define what you’re dealing with.",
      "Clarity is not optional — it is foundational.",
      "Without it, progress stalls."
    ],

    insight: [
      "Clarity creates direction.",
      "When you reduce your situation to something precise, movement becomes possible.",
      "Simplicity unlocks action."
    ],

    action: [
      "Write your situation in one clear sentence",
      "Identify the single core issue within it",
      "Choose one action that directly addresses that issue",
      "Execute immediately without adding complexity"
    ]
  },


  unclear: {
    anchor: "There’s something here, but it hasn’t fully surfaced yet.",

    signal: [
      "What you’ve expressed is active, but not clearly defined.",
      "There is movement in your thinking, but no precise structure.",
      "It hasn’t yet formed into something actionable."
    ],

    state: [
      "Your thoughts are present, but not organised.",
      "You are dealing with internal noise rather than clarity.",
      "This prevents decisive action."
    ],

    distortion: [
      "Without a clearly defined problem, the system cannot generate a solution.",
      "This creates hesitation and uncertainty.",
      "The lack of structure is the blocker."
    ],

    recognition: [
      "You cannot move forward until you define what’s happening.",
      "Clarity is the first step of all progress.",
      "Everything else builds from that."
    ],

    insight: [
      "Simplifying your situation creates direction.",
      "When you reduce it to something precise, action becomes available.",
      "Clarity unlocks movement."
    ],

    action: [
      "Describe your situation more specifically",
      "Reduce it to one clear sentence",
      "Identify what actually needs to change",
      "Take one immediate step forward"
    ]
  }

};


// ===============================
// OUTPUT COMPOSER
// ===============================

function generateResponse(input) {

  if (needsClarity(input)) {
    return {
      clarify: true,
      question: getClarifyingQuestion()
    };
  }

  const type = classifySignal(input);
  const r = responses[type];

  return {
    clarify: false,
    output: {
      anchor: r.anchor,
      signal: r.signal.join(" "),
      state: r.state.join(" "),
      distortion: r.distortion.join(" "),
      recognition: r.recognition.join(" "),
      insight: r.insight.join(" "),
      action: r.action
    }
  };
}
