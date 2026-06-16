const input = document.getElementById("signalInput");
const output = document.getElementById("output");
const historyContainer = document.getElementById("history");

const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const copyBtn = document.getElementById("copyInsightBtn");

// FORMAT RESPONSE
function formatResponse(text) {
  return text
    .replace("SIGNAL:", "<strong class='signal'>SIGNAL:</strong>")
    .replace("STATE:", "<strong class='state'>STATE:</strong>")
    .replace("DISTORTION:", "<strong class='distortion'>DISTORTION:</strong>")
    .replace("RECOGNITION:", "<strong class='recognition'>RECOGNITION:</strong>")
    .replace("INSIGHT:", "<strong class='insight'>INSIGHT:</strong>")
    .replace("NEXT BEST ACTION:", "<strong>NEXT BEST ACTION:</strong>")
    .replace(/\n/g, "<br>");
}

// PROCESSING ANIMATION
function startProcessing() {
  const phases = [
    "Receiving signal...",
    "Stabilising...",
    "Interpreting...",
    "Generating clarity..."
  ];

  let i = 0;

  return setInterval(() => {
    output.innerHTML = `<div class="output-card">${phases[i]}</div>`;
    i = (i + 1) % phases.length;
  }, 700);
}

// GENERATE INSIGHT
generateBtn.onclick = async () => {
  const signal = input.value.trim();

  if (!signal) {
    output.innerHTML = "<div class='output-card'>Enter a signal first.</div>";
    return;
  }

  const interval = startProcessing();

  try {
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    });

    const data = await res.json();

    clearInterval(interval);

    output.innerHTML = `
      <div class="output-card">
        ${formatResponse(data.response)}
      </div>
    `;

    saveToHistory(signal, data.response);

  } catch (err) {
    clearInterval(interval);
    output.innerHTML = "<div class='output-card'>Connection error.</div>";
  }
};

// COPY INSIGHT
copyBtn.onclick = () => {
  const text = output.innerText;

  navigator.clipboard.writeText(text);

  copyBtn.innerText = "Copied ✓";

  setTimeout(() => {
    copyBtn.innerText = "Copy Insight";
  }, 2000);
};

// CLEAR SIGNAL
clearBtn.onclick = () => {
  input.value = "";
};

// CLEAR HISTORY
clearHistoryBtn.onclick = () => {
  localStorage.removeItem("history");
  renderHistory();
};

// SAVE HISTORY
function saveToHistory(signal, response) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({ signal, response });

  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
}

// RENDER HISTORY
function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  historyContainer.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "output-card";

    div.innerHTML = `
      <strong>Signal:</strong> ${item.signal}<br><br>
      ${formatResponse(item.response)}
    `;

    historyContainer.appendChild(div);
  });
}

renderHistory();
