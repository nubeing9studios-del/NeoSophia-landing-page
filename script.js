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
  if (input) input.value = "";
  if (outputEl) outputEl.innerHTML = "";
}

async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const input = inputEl.value;
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  if (!input.trim()) {
    outputEl.innerText = "Please enter a signal first.";
    return;
  }

  button.innerText = "Reading the signal...";
  button.disabled = true;
  outputEl.innerText = "Processing your signal...";

  try {
    const res = await fetch("https://neosophia-landing-page.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    const insight = data.output || "No response received.";
    outputEl.innerText = insight;

    saveToHistory(input, insight);
    renderHistory();

    showEnterButton();
  } catch (err) {
    outputEl.innerText = "Could not connect to the AI server. Your signal is still captured locally — try again shortly.";
  }

  button.innerText = "Generate Insight";
  button.disabled = false;
}

function showEnterButton() {
  setTimeout(() => {
    const oldBtn = document.getElementById("enterBtn");
    if (oldBtn) oldBtn.remove();

    const enterBtn = document.createElement("button");
    enterBtn.id = "enterBtn";
    enterBtn.innerText = "Enter Nubeing 9 Studios";
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
  }

  history.slice(0, 5).forEach(entry => {
    const div = document.createElement("div");
    div.className = "history-entry";

    div.innerHTML = `
      <strong>Signal:</strong><br>${entry.input}<br><br>
      <strong>Insight:</strong><br>${entry.output}<br>
      <div class="history-meta">${entry.time}</div>
    `;

    container.appendChild(div);
  });
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
    message.innerText = "Feedback captured locally. Thank you.";
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
  window.open("https://nubeing9.com", "_blank");
}

window.onload = renderHistory;
