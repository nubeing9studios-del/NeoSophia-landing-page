async function generateInsight() {
  const input = document.getElementById("signalInput").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerHTML = "<p>Please enter a signal.</p>";
    return;
  }

  output.innerHTML = "<p>Processing...</p>";

  try {
    const response = await fetch("https://neosophia-landing-page.onrender.com/api/signal", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ signal: input })
})
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal: input })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    output.innerHTML = `
      <div class="result-block">
        <p><strong>SIGNAL:</strong> ${data.signal}</p>
        <p><strong>STATE:</strong> ${data.state}</p>
        <p><strong>DISTORTION:</strong> ${data.distortion}</p>
        <p><strong>RECOGNITION:</strong> ${data.recognition}</p>
        <p><strong>INSIGHT:</strong> ${data.insight}</p>
        <p><strong>NEXT BEST ACTION:</strong></p>
        <ol>
          ${data.actions.map(a => `<li>${a}</li>`).join("")}
        </ol>
      </div>
    `;
  } catch (error) {
    output.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}

// BUTTON CONNECTION
document.getElementById("generateBtn").addEventListener("click", generateInsight);
