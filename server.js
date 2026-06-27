document.getElementById("generateBtn").addEventListener("click", async () => {
  const input = document.getElementById("signalInput").value.trim();
  const outputDiv = document.getElementById("output");

  if (!input) {
    outputDiv.innerHTML = "<span style='color:red;'>Please enter a signal.</span>";
    return;
  }

  outputDiv.innerHTML = "Generating insight...";

  try {
    const response = await fetch("/api/signal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await response.json();

    if (data.error) {
      outputDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
      return;
    }

    // ✅ FIX: Properly render Next Action list
    let actionsHTML = "";

    if (Array.isArray(data.nextAction) && data.nextAction.length > 0) {
      actionsHTML = "<ol>" +
        data.nextAction.map(action => `<li>${action}</li>`).join("") +
        "</ol>";
    } else {
      actionsHTML = "<p>—</p>";
    }

    outputDiv.innerHTML = `
      <strong>SIGNAL:</strong> ${data.signal}<br><br>
      <strong>STATE:</strong> ${data.state}<br><br>
      <strong>DISTORTION:</strong> ${data.distortion}<br><br>
      <strong>RECOGNITION:</strong> ${data.recognition}<br><br>
      <strong>INSIGHT:</strong> ${data.insight}<br><br>
      <strong>NEXT BEST ACTION:</strong>
      ${actionsHTML}
    `;

  } catch (error) {
    console.error(error);
    outputDiv.innerHTML = "<span style='color:red;'>Error connecting to server.</span>";
  }
});
