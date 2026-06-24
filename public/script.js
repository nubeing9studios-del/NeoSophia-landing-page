async function generateInsight() {
  const inputField = document.getElementById("userInput");
  const outputDiv = document.getElementById("output");

  const userInput = inputField.value;

  if (!userInput) {
    outputDiv.innerHTML = "Please enter a signal.";
    return;
  }

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

    const data = await response.json();

    if (data.error) {
      outputDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
      return;
    }

    outputDiv.innerHTML = `
      <strong>SIGNAL:</strong> ${data.signal}<br><br>
      <strong>STATE:</strong> ${data.state}<br><br>
      <strong>DISTORTION:</strong> ${data.distortion}<br><br>
      <strong>RECOGNITION:</strong> ${data.recognition}<br><br>
      <strong>INSIGHT:</strong> ${data.insight}<br><br>
      <strong>NEXT BEST ACTION:</strong> ${data.action}
    `;

  } catch (error) {
    outputDiv.innerHTML = `<span style="color:red;">Error connecting to server</span>`;
    console.error(error);
  }
}
