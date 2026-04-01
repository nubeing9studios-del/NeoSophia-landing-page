function scrollToSection() {
  const loop = document.getElementById("loop");
  if (loop) {
    loop.scrollIntoView({ behavior: "smooth" });
  }
}

async function generateInsight() {
  const input = document.getElementById("signalInput").value;
  const outputEl = document.getElementById("output");
  const button = document.getElementById("generateBtn");

  if (!input.trim()) {
    outputEl.innerText = "Please enter a signal.";
    return;
  }

  button.innerText = "Thinking...";
  button.disabled = true;
  outputEl.innerText = "Processing your signal...";

  try {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    outputEl.innerText = data.output;

    saveToHistory(input, data.output);
    renderHistory();

    showEnterButton();
  } catch (err) {
    outputEl.innerText = "Could not connect to the AI server.";
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
    enterBtn.innerText = "Enter Nubeing9";
    enterBtn.style.marginTop = "20px";
    enterBtn.style.padding = "10px 20px";
    enterBtn.style.background = "#ffd700";
    enterBtn.style.border = "none";
    enterBtn.style.cursor = "pointer";
    enterBtn.style.borderRadius = "8px";

    enterBtn.onclick = () => {
      triggerSpiral();
    };

    const outputEl = document.getElementById("output");
    outputEl.appendChild(document.createElement("br"));
    outputEl.appendChild(enterBtn);
  }, 1500);
}

function saveToHistory(input, output) {
  const history = JSON.parse(localStorage.getItem("signalHistory")) || [];

  history.unshift({
    input,
    output,
    time: new Date().toLocaleString(),
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