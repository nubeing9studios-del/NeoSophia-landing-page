const input = document.getElementById("signalInput");
const output = document.getElementById("output");
const status = document.getElementById("status");

async function generateInsight() {
  const signal = input.value.trim();

  if (!signal) {
    output.innerHTML = "Enter a signal first.";
    return;
  }

  status.textContent = "Processing signal...";

  try {
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    });

    const data = await res.json();

    if (!data.response) {
      output.innerHTML = "No response generated.";
      return;
    }

    // === FORMAT OUTPUT ===
    const formatted = formatOutput(data.response);
    output.innerHTML = formatted;

    status.textContent = "Signal processed.";
  } catch (err) {
    console.error(err);
    output.innerHTML = "Error generating insight.";
    status.textContent = "";
  }
}

function formatOutput(text) {
  const sections = text.split("\n");

  let html = "";

  sections.forEach(line => {
    if (line.startsWith("SIGNAL:")) {
      html += `<div class="block signal"><strong>${line}</strong></div>`;
    } else if (line.startsWith("STATE:")) {
      html += `<div class="block state"><strong>${line}</strong></div>`;
    } else if (line.startsWith("DISTORTION:")) {
      html += `<div class="block distortion"><strong>${line}</strong></div>`;
    } else if (line.startsWith("RECOGNITION:")) {
      html += `<div class="block recognition"><strong>${line}</strong></div>`;
    } else if (line.startsWith("INSIGHT:")) {
      html += `<div class="block state"><strong>${line}</strong></div>`;
    } else if (line.startsWith("NEXT BEST ACTION:")) {
      html += `<div class="block action"><strong>${line}</strong></div>`;
    } else {
      html += `<div>${line}</div>`;
    }
  });

  return html;
}
