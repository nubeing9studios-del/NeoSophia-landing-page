let pendingClarification = null;

function scrollToTool() {
  const tool = document.getElementById("toolSection");
  if (tool) {
    tool.scrollIntoView({ behavior: "smooth" });
  }
}

function scrollToSection() {
  scrollToTool();
}

function clearSignal() {
  const input = document.getElementById("signalInput");
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  pendingClarification = null;

  if (input) {
    input.value = "";
    input.placeholder = "Example: I feel stuck and I don’t know what to focus on.";
  }

  if (outputEl) outputEl.innerHTML = "";
  if (button) button.innerText = "Capture Signal";
}

async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const input = inputEl.value;
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  if (!input.trim()) {
    outputEl.innerText = pendingClarification
      ? "Please answer the clarifying question first."
      : "Please enter a signal first.";
    return;
  }

  const displayInput = pendingClarification
    ? {
        originalSignal: pendingClarification.originalSignal,
        clarificationAnswer: input
      }
    : input;

  const payloadInput = pendingClarification
    ? `Original signal: ${pendingClarification.originalSignal}\nClarifying question asked: ${pendingClarification.question}\nUser clarification answer: ${input}\n\nNow provide the full Signal Capture response using SIGNAL, STATE, DISTORTION, INSIGHT, and NEXT BEST ACTION. Do not ask another clarifying question unless the answer is still impossible to interpret.`
    : input;

  button.innerText = pendingClarification ? "Reading clarification..." : "Reading the signal...";
  button.disabled = true;
  outputEl.innerText = pendingClarification ? "Processing your clarification..." : "Processing your signal...";

  try {
    const res = await fetch("https://neosophia-landing-page.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: payloadInput })
    });

    const data = await res.json();
    const insight = data.output || "No response received.";
    outputEl.innerText = insight;

    if (isClarifyingQuestion(insight)) {
      pendingClarification = {
        originalSignal: input,
        question: insight
      };
      inputEl.value = "";
      inputEl.placeholder = "Answer the clarifying question here, then press Submit Clarification.";
      button.innerText = "Submit Clarification";
    } else {
      saveToHistory(displayInput, insight);
      renderHistory();
      pendingClarification = null;
      inputEl.placeholder = "Example: I feel stuck and I don’t know what to focus on.";
      button.innerText = "Capture Signal";
      showEnterButton();
    }
  } catch (err) {
    outputEl.innerText = "Could not connect to the AI server. Your signal is still captured locally — try again shortly.";
  }

  button.disabled = false;

  if (!pendingClarification) {
    button.innerText = "Capture Signal";
  }
}

function isClarifyingQuestion(text) {
  const normalized = text.trim().toUpperCase();
  return normalized.startsWith("CLARIFYING QUESTION");
}

function showEnterButton() {
  setTimeout(() => {
    const oldBtn = document.getElementById("enterBtn");
    if (oldBtn) oldBtn.remove();

    const enterBtn = document.createElement("button");
    enterBtn.id = "enterBtn";
    enterBtn.innerText = "Explore Coherence Tools";
    enterBtn.style.marginTop = "20px";

    enterBtn.onclick = () => {
      triggerSpiral();
    };

    const outputEl = document.getElementById("output");
    outputEl.appendChild(document.createElement("br"));
    outputEl.appendChild(enterBtn);
  }, 1200);
}

function saveToHistory(input, output) {
  const history = JSON.parse(localStorage.getItem("signalHistory")) || [];

  history.unshift({
    input,
    output,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("signalHistory", JSON.stringify(history));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("signalHistory")) || [];
  const container = document.getElementById("history");

  if (!container) return;

  container.innerHTML = "";

  if (history.length > 0) {
    const title = document.createElement("div");
    title.className = "history-title";
    title.innerText = "Recent Signal History";
    container.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "history-actions";
    actions.innerHTML = `<button class="history-clear-btn" onclick="clearHistory()">Clear Signal History</button>`;
    container.appendChild(actions);
  }

  history.slice(0, 5).forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";

    div.innerHTML = `
      ${formatSignalForHistory(entry.input)}<br><br>
      <strong>Insight:</strong><br>${formatTextForDisplay(entry.output)}<br>
      <div class="history-meta">${escapeHtml(entry.time)}</div>
    `;

    container.appendChild(div);
  });
}

function formatSignalForHistory(input) {
  if (input && typeof input === "object" && input.originalSignal && input.clarificationAnswer) {
    return `
      <strong>Original Signal:</strong><br>${formatTextForDisplay(input.originalSignal)}<br><br>
      <strong>Clarification:</strong><br>${formatTextForDisplay(input.clarificationAnswer)}
    `;
  }

  return `<strong>Signal:</strong><br>${formatTextForDisplay(input || "")}`;
}

function formatTextForDisplay(text) {
  return escapeHtml(String(text || "")).replace(/\n/g, "<br>");
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clearHistory() {
  localStorage.removeItem("signalHistory");
  renderHistory();
}

function recordFeedback(value) {
  const feedback = JSON.parse(localStorage.getItem("signalFeedback")) || [];
  feedback.unshift({
    value,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("signalFeedback", JSON.stringify(feedback));

  const message = document.getElementById("feedbackMessage");
  if (message) {
    message.innerText = "Feedback noted on this device. Full feedback capture is coming soon.";
  }
}

function triggerSpiral() {
  const overlay = document.getElementById("thresholdOverlay");
  const arrival = document.getElementById("arrivalScreen");

  overlay.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.add("hidden");
    arrival.classList.remove("hidden");
  }, 2000);
}

function returnToTool() {
  const arrival = document.getElementById("arrivalScreen");
  arrival.classList.add("hidden");

  document.getElementById("toolSection").scrollIntoView({ behavior: "smooth" });
}

function enterWebsite() {
  window.open("https://nubeing9.com/services", "_blank");
}

window.onload = renderHistory;
