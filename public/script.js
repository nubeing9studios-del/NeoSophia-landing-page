async function generateInsight() {
  const input = document.getElementById("signalInput").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerHTML = "<p>Please enter a signal.</p>";
    return;
  }

  output.innerHTML = "<p>Processing...</p>";

  // 🔥 LOCAL ENGINE (NO API)
  const result = {
    signal: "Stuck between vision and execution",
    state: "You have clarity of direction but lack structured implementation",
    distortion: "Overthinking and trying to solve everything at once",
    recognition: "The issue is not ability — it's lack of prioritisation",
    insight: "Clarity comes from reducing scope and acting on one defined step",
    actions: [
      "Choose ONE task that moves your project forward",
      "Complete it fully today",
      "Write the next 3 steps immediately after"
    ]
  };

  output.innerHTML = `
    <div class="result-block">
      <p><strong>SIGNAL:</strong> ${result.signal}</p>
      <p><strong>STATE:</strong> ${result.state}</p>
      <p><strong>DISTORTION:</strong> ${result.distortion}</p>
      <p><strong>RECOGNITION:</strong> ${result.recognition}</p>
      <p><strong>INSIGHT:</strong> ${result.insight}</p>
      <p><strong>NEXT BEST ACTION:</strong></p>
      <ol>
        ${result.actions.map(a => `<li>${a}</li>`).join("")}
      </ol>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("generateBtn")
    .addEventListener("click", generateInsight);
});
