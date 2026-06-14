async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const outputEl = document.getElementById("output");
  const historyEl = document.getElementById("history");

  const input = inputEl.value.trim();

  if (!input) {
    outputEl.innerText = "Enter a signal first.";
    return;
  }

  outputEl.innerText = "Processing...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await response.json();
    const result = data.output || "No response.";

    // === MAIN OUTPUT ===
    outputEl.innerText = result;

    // === HISTORY (CLEAN + CONTROLLED) ===
    const entry = document.createElement("div");
    entry.className = "history-entry";

    entry.innerHTML = `
      <strong>Signal:</strong> ${input}
      <br><br>
      <strong>Response:</strong>
      <pre>${result}</pre>
      <hr>
    `;

    historyEl.prepend(entry);

    // Clear input AFTER success
    inputEl.value = "";

  } catch (error) {
    outputEl.innerText = "Error processing request.";
  }
}

function clearSignal() {
  document.getElementById("signalInput").value = "";
}

function clearHistory() {
  document.getElementById("history").innerHTML = "";
}
