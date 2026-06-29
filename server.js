async function generateInsight() {
  const inputField = document.getElementById("userInput");
  const outputBox = document.getElementById("output");

  const input = inputField.value.trim();

  if (!input) {
    outputBox.innerHTML = "Please enter a signal.";
    return;
  }

  let step = 0;
  let currentInput = input;

  while (step < 3) {
    const res = await fetch("/api/signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: currentInput, step })
    });

    const data = await res.json();

    // 🔹 HANDLE CLARIFY MODE
    if (data.type === "clarify") {
      const answer = prompt(`${data.anchor}\n\n${data.question}`);

      if (!answer) {
        outputBox.innerHTML = "No response provided.";
        return;
      }

      currentInput = answer;
      step++;
      continue;
    }

    // 🔹 HANDLE FULL RESPONSE
    outputBox.innerHTML = `
      <div><strong>ANCHOR:</strong> ${data.anchor}</div><br>

      <div><strong>SIGNAL:</strong> ${data.signal}</div><br>
      <div><strong>STATE:</strong> ${data.state}</div><br>
      <div><strong>DISTORTION:</strong> ${data.distortion}</div><br>
      <div><strong>RECOGNITION:</strong> ${data.recognition}</div><br>
      <div><strong>INSIGHT:</strong> ${data.insight}</div><br>

      <div><strong>NEXT BEST ACTION:</strong></div>
      <ol>
        ${data.nextAction.map(a => `<li>${a}</li>`).join("")}
      </ol>
    `;

    return;
  }

  outputBox.innerHTML = "Unable to generate a clear response.";
}
