let history = [];

async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const outputEl = document.getElementById("output");
  const input = inputEl.value.trim();

  if (!input) {
    outputEl.innerText = "Enter a signal.";
    return;
  }

  outputEl.innerText = "Processing...";

  try {
    const res = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();

    const output = data.output || "No response.";

    // Save to history
    history.unshift({
      signal: input,
      output: output,
      time: new Date().toLocaleString()
    });

    renderHistory();

    // ✅ CLEAR INPUT AFTER SUBMIT
    inputEl.value = "";

    // ✅ SHOW LATEST OUTPUT
    outputEl.innerHTML = formatOutput(output);

  } catch (err) {
    outputEl.innerText = "Connection error. Try again.";
  }
}

/* =========================
   FORMAT OUTPUT
========================= */

function formatOutput(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(/(SIGNAL:|STATE:|DISTORTION:|RECOGNITION:|INSIGHT:|NEXT BEST ACTION:)/g, "<strong>$1</strong>");
}

/* =========================
   HISTORY SYSTEM
========================= */

function renderHistory() {
  const container = document.getElementById("history");

  if (!container) return;

  container.innerHTML = history
    .map(item => `
      <div style="margin-bottom: 16px;">
        <div><strong>Signal:</strong> ${item.signal}</div>
        <div>${formatOutput(item.output)}</div>
        <div style="font-size: 12px; opacity: 0.6;">${item.time}</div>
      </div>
    `)
    .join("");
}

/* =========================
   CLEAR INPUT BUTTON
========================= */

function clearSignal() {
  document.getElementById("signalInput").value = "";
}

/* =========================
   CLEAR HISTORY BUTTON
========================= */

function clearHistory() {
  history = [];
  renderHistory();
}
