// =========================
// SIGNAL CAPTURE FRONTEND
// FULL REPLACEMENT SCRIPT
// =========================

const input = document.getElementById("signalInput");
const output = document.getElementById("output");
const historyContainer = document.getElementById("history");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// =========================
// FORMAT RESPONSE
// =========================

function formatResponse(text) {
  return text
    .replace("SIGNAL:", "<strong class='signal'>SIGNAL:</strong>")
    .replace("STATE:", "<strong class='state'>STATE:</strong>")
    .replace("DISTORTION:", "<strong class='distortion'>DISTORTION:</strong>")
    .replace("RECOGNITION:", "<strong class='recognition'>RECOGNITION:</strong>")
    .replace("INSIGHT:", "<strong class='insight'>INSIGHT:</strong>")
    .replace("NEXT BEST ACTION:", "<div class='action-section'><strong>NEXT BEST ACTION:</strong></div>")
    .replace(/1\.\s/g, "<div class='action-step'>1. ")
    .replace(/2\.\s/g, "<div class='action-step'>2. ")
    .replace(/3\.\s/g, "<div class='action-step'>3. ")
    .replace(/\n/g, "<br>");
}

// =========================
// LIVE PROCESSING STATES
// =========================

function startProcessingAnimation() {
  const phases = [
    "Receiving signal...",
    "Stabilising noise...",
    "Interpreting pattern...",
    "Generating clarity..."
  ];

  let i = 0;

  return setInterval(() => {
    output.innerHTML = `<div class="output-card">${phases[i]}</div>`;
    i = (i + 1) % phases.length;
  }, 800);
}

// =========================
// SAVE TO HISTORY
// =========================

function saveToHistory(signal, response) {
  const history = JSON.parse(localStorage.getItem("signalHistory")) || [];

  history.unshift({
    signal,
    response,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("signalHistory", JSON.stringify(history));
  renderHistory();
}

// =========================
// RENDER HISTORY
// =========================

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("signalHistory")) || [];

  historyContainer.innerHTML = "";

  history.forEach(item => {
    const card = document.createElement("div");
    card.className = "output-card";

    card.innerHTML = `
      <p><strong>Signal:</strong> ${item.signal}</p>
      <p>${formatResponse(item.response)}</p>
      <small>${item.time}</small>
    `;

    historyContainer.appendChild(card);
  });
}

// =========================
// GENERATE INSIGHT
// =========================

generateBtn.addEventListener("click", async () => {
  const signal = input.value.trim();

  if (!signal) {
    output.innerHTML = "<div class='output-card'>Enter a signal first.</div>";
    return;
  }

  // Start animation
  const interval = startProcessingAnimation();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    });

    const data = await res.json();

    clearInterval(interval);

    if (data.response) {
      output.innerHTML = `<div class="output-card">${formatResponse(data.response)}</div>`;
      saveToHistory(signal, data.response);
    } else {
      output.innerHTML = "<div class='output-card'>No response received.</div>";
    }

  } catch (err) {
    clearInterval(interval);
    output.innerHTML = "<div class='output-card'>Connection error. Try again.</div>";
  }
});

// =========================
// CLEAR INPUT
// =========================

clearBtn.addEventListener("click", () => {
  input.value = "";
});

// =========================
// CLEAR HISTORY
// =========================

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("signalHistory");
  renderHistory();
});

// =========================
// INIT
// =========================

renderHistory();
