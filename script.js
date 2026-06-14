let clarificationCount = 0;

async function generateInsight() {
  const inputEl = document.getElementById("signalInput");
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  const input = inputEl.value.trim();

  if (!input) {
    outputEl.innerText = "Enter a signal.";
    return;
  }

  button.innerText = "Reading...";
  button.disabled = true;
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
    let text = data.output || "No response.";

    // 🚨 HANDLE CLARIFYING QUESTION
    if (text.includes("CLARIFYING QUESTION")) {
      clarificationCount++;

      if (clarificationCount >= 2) {
        clarificationCount = 0;
      }

      outputEl.innerHTML = `
        <div style="padding:20px; font-size:18px;">
          ${text}
        </div>
      `;
      return;
    }

    // ✅ RESET counter when full answer arrives
    clarificationCount = 0;

    // 🚨 CLEAN + FORMAT OUTPUT
    const sections = {
      SIGNAL: "",
      STATE: "",
      DISTORTION: "",
      RECOGNITION: "",
      INSIGHT: "",
      "NEXT BEST ACTION": ""
    };

    Object.keys(sections).forEach(key => {
      const regex = new RegExp(`${key}:([\\s\\S]*?)(?=(SIGNAL:|STATE:|DISTORTION:|RECOGNITION:|INSIGHT:|NEXT BEST ACTION:|$))`);
      const match = text.match(regex);
      if (match) {
        sections[key] = match[1].trim();
      }
    });

    // ✅ BUILD CLEAN UI
    outputEl.innerHTML = `
      <div style="padding:20px; line-height:1.6;">
        <p><strong>SIGNAL:</strong> ${sections.SIGNAL}</p>
        <p><strong>STATE:</strong> ${sections.STATE}</p>
        <p><strong>DISTORTION:</strong> ${sections.DISTORTION}</p>
        <p><strong>RECOGNITION:</strong> ${sections.RECOGNITION}</p>
        <p><strong>INSIGHT:</strong> ${sections.INSIGHT}</p>
        <p><strong>NEXT BEST ACTION:</strong> ${sections["NEXT BEST ACTION"]}</p>
      </div>
    `;

  } catch (err) {
    outputEl.innerText = "Connection error. Try again.";
  }

  button.innerText = "Capture Signal";
  button.disabled = false;
}
