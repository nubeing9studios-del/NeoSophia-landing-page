document.getElementById("generateBtn").addEventListener("click", async () => {
  const inputField = document.getElementById("signalInput");
  const outputDiv = document.getElementById("output");

  const userInput = inputField.value.trim();

  if (!userInput) {
    outputDiv.innerHTML = "Please enter a signal.";
    return;
  }

  outputDiv.innerHTML = "Processing...";

  try {
    const response = await fetch("/api/signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: userInput })
    });

    const data = await response.json();

    if (data.error) {
      outputDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
      return;
    }

    // 🔥 FIX: Properly render nextAction array
    let actionsHTML = "";

    if (Array.isArray(data.nextAction)) {
      actionsHTML = data.nextAction
        .map((action, index) => `${index + 1}. ${action}`)
        .join("<br>");
    } else {
      actionsHTML = "—";
    }

    outputDiv.innerHTML = `
      <strong>SIGNAL:</strong> ${data.signal}<br><br>
      <strong>STATE:</strong> ${data.state}<br><br>
      <strong>DISTORTION:</strong> ${data.distortion}<br><br>
      <strong>RECOGNITION:</strong> ${data.recognition}<br><br>
      <strong>INSIGHT:</strong> ${data.insight}<br><br>
      <strong>NEXT BEST ACTION:</strong><br>${actionsHTML}
    `;

  } catch (error) {
    outputDiv.innerHTML = `<span style="color:red;">Error connecting to server</span>`;
    console.error(error);
  }
});
