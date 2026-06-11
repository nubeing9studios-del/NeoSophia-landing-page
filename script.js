let pendingClarification = null;

async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const input = inputEl.value;
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  if (!input.trim()) {
    outputEl.innerText = pendingClarification
      ? "Answer the clarifying question."
      : "Enter a signal.";
    return;
  }

  button.innerText = "Reading...";
  button.disabled = true;
  outputEl.innerText = "Processing...";

  try {
    const res = await fetch("https://neosophia-landing-page.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    const insight = data.output || "No response.";

    outputEl.innerHTML = formatOutput(insight);

    saveToHistory(input, insight);
    renderHistory();

  } catch (err) {
    outputEl.innerText = "Connection error. Try again.";
  }

  button.disabled = false;
  button.innerText = "Capture Signal";
}

function formatOutput(text) {
  return text
    .replace("SIGNAL:", "<b>SIGNAL:</b>")
    .replace("STATE:", "<br><b>STATE:</b>")
    .replace("DISTORTION:", "<br><b>DISTORTION:</b>")
    .replace("INSIGHT:", "<br><b>INSIGHT:</b>")
    .replace("NEXT ACTION:", "<br><b>NEXT ACTION:</b>");
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

  history.slice(0, 5).forEach(entry => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>Signal:</strong><br>${entry.input}<br><br>
      <strong>Insight:</strong><br>${entry.output}<br>
      <small>${entry.time}</small>
    `;

    container.appendChild(div);
  });
}

window.onload = renderHistory;
