let step = 0;
let currentInput = "";

async function startSignal() {
  step = 0;
  currentInput = document.getElementById("userInput").value.trim();

  if (!currentInput) {
    displayOutput("Please enter a signal.");
    return;
  }

  processSignal();
}

async function processSignal() {
  const res = await fetch("/api/signal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: currentInput,
      step: step
    })
  });

  const data = await res.json();

  // 🔹 HANDLE CLARIFY MODE
  if (data.type === "clarify") {
    showQuestion(data);
    return;
  }

  // 🔹 HANDLE FULL RESPONSE
  showOutput(data);
}

function showQuestion(data) {
  const questionArea = document.getElementById("questionArea");

  questionArea.innerHTML = `
    <div class="question-box">
      <div class="section">${data.anchor}</div>
      <div class="section"><strong>${data.question}</strong></div>

      <input id="clarifyInput" placeholder="Type your answer..." />

      <button onclick="submitClarification()">Continue</button>
    </div>
  `;
}

function submitClarification() {
  const answer = document.getElementById("clarifyInput").value.trim();

  if (!answer) return;

  currentInput = answer;
  step++;

  document.getElementById("questionArea").innerHTML = "";

  processSignal();
}

function showOutput(data) {
  const output = document.getElementById("output");

  output.innerHTML = `
    <div class="section"><span class="label">ANCHOR:</span> ${data.anchor}</div>

    <div class="section"><span class="label">SIGNAL:</span> ${data.signal}</div>
    <div class="section"><span class="label">STATE:</span> ${data.state}</div>
    <div class="section"><span class="label">DISTORTION:</span> ${data.distortion}</div>
    <div class="section"><span class="label">RECOGNITION:</span> ${data.recognition}</div>
    <div class="section"><span class="label">INSIGHT:</span> ${data.insight}</div>

    <div class="section"><span class="label">NEXT BEST ACTION:</span></div>
    <ol>
      ${data.nextAction.map(a => `<li>${a}</li>`).join("")}
    </ol>
  `;
}

function displayOutput(message) {
  document.getElementById("output").innerHTML = message;
}
