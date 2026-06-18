const button = document.getElementById("generate");
const input = document.getElementById("signalInput");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
  const signal = input.value.trim();

  if (!signal) {
    output.innerHTML = "<p>Please enter a signal.</p>";
    return;
  }

  output.innerHTML = "<p>Processing...</p>";

  try {
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signal }),
    });

    const data = await res.json();

    if (!data.response) {
      output.innerHTML = "<p>No response generated.</p>";
      return;
    }

    const formatted = formatOutput(data.response);
    output.innerHTML = formatted;

  } catch (err) {
    output.innerHTML = "<p>Error generating insight.</p>";
  }
});


function formatOutput(text) {
  const lines = text.split("\n").filter(line => line.trim() !== "");

  let html = `<div class="output-title">Output</div>`;

  lines.forEach(line => {

    if (line.startsWith("SIGNAL:")) {
      html += `<p class="signal"><strong>${line}</strong></p>`;
    }
    else if (line.startsWith("STATE:")) {
      html += `<p class="state"><strong>${line}</strong></p>`;
    }
    else if (line.startsWith("DISTORTION:")) {
      html += `<p class="distortion"><strong>${line}</strong></p>`;
    }
    else if (line.startsWith("RECOGNITION:")) {
      html += `<p class="recognition"><strong>${line}</strong></p>`;
    }
    else if (line.startsWith("INSIGHT:")) {
      html += `<p class="insight"><strong>${line}</strong></p>`;
    }
    else if (line.startsWith("NEXT BEST ACTION")) {
      html += `<p class="action"><strong>${line}</strong></p>`;
    }
    else if (line.match(/^\d+\./)) {
      html += `<p style="margin-left:10px;">${line}</p>`;
    }
    else {
      html += `<p>${line}</p>`;
    }

  });

  return html;
}
