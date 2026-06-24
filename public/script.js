async function generateInsight() {
  const inputField = document.getElementById("userInput");
  const outputDiv = document.getElementById("output");

  const userInput = inputField.value.trim();

  if (!userInput) {
    outputDiv.innerHTML = "Please enter a signal.";
    return;
  }

  try {
    const response = await fetch("/api/signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: userInput })
    });

    // 🔴 Catch non-JSON responses (IMPORTANT)
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      outputDiv.innerHTML = `<span style="color:red;">Server error (not JSON): ${text}</span>`;
      return;
    }

    if (data.error) {
      outputDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
      return;
    }

    // ✅ Render output cleanly
    outputDiv.innerHTML = `
      <strong>SIGNAL:</strong> ${data.signal}<br><br>
      <strong>STATE:</strong> ${data.state}<br><br>
      <strong>DISTORTION:</strong> ${data.distortion}<br><br>
      <strong>RECOGNITION:</strong> ${data.recognition}<br><br>
      <strong>INSIGHT:</strong> ${data.insight}<br><br>
      <strong>NEXT BEST ACTION:</strong>
      <ol>
        ${data.nextAction.map(step => `<li>${step}</li>`).join("")}
      </ol>
    `;
  } catch (error) {
    console.error(error);
    outputDiv.innerHTML = `<span style="color:red;">Error connecting to server</span>`;
  }
}
