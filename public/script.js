document.getElementById("generate").addEventListener("click", async () => {
  const input = document.getElementById("signalInput").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerHTML = "Please enter a signal.";
    return;
  }

  output.innerHTML = "Processing...";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signal: input }),
    });

    const data = await res.json();

    console.log("API RESPONSE:", data); // 🔍 DEBUG LINE

    // ✅ SAFE HANDLING
    const rawText =
      data.result ||
      data.output ||
      data.message ||
      "No response generated.";

    const formatted = formatOutput(rawText);

    output.innerHTML = `
      <div class="output-title">Output</div>
      ${formatted}

      <div style="margin-top:20px; display:flex; gap:10px;">
        <button onclick="copyOutput()">Copy Insight</button>
        <button onclick="clearAll()">Clear</button>
      </div>
    `;

  } catch (err) {
    console.error(err);
    output.innerHTML = "Error connecting to server.";
  }
});

/* FORMAT OUTPUT */
function formatOutput(text) {
  return text
    .replace("SIGNAL:", '<p class="signal"><strong>SIGNAL:</strong>')
    .replace("STATE:", '</p><p class="state"><strong>STATE:</strong>')
    .replace("DISTORTION:", '</p><p class="distortion"><strong>DISTORTION:</strong>')
    .replace("RECOGNITION:", '</p><p class="recognition"><strong>RECOGNITION:</strong>')
    .replace("INSIGHT:", '</p><p class="insight"><strong>INSIGHT:</strong>')
    .replace("NEXT BEST ACTION:", '</p><p class="action"><strong>NEXT BEST ACTION:</strong>')
    + '</p>';
}

/* COPY */
function copyOutput() {
  const text = document.getElementById("output").innerText;
  navigator.clipboard.writeText(text);
  alert("Insight copied.");
}

/* CLEAR */
function clearAll() {
  document.getElementById("signalInput").value = "";
  document.getElementById("output").innerHTML = "";
}
