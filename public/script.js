// Signal Capture Frontend Script (Clean Final Version)

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("generateBtn");
  const inputField = document.getElementById("signalInput");
  const outputDiv = document.getElementById("output");

  if (!button || !inputField || !outputDiv) {
    console.error("❌ Missing required DOM elements");
    return;
  }

  console.log("✅ Signal Capture Ready");

  button.addEventListener("click", async () => {
    const userInput = inputField.value.trim();

    if (!userInput) {
      outputDiv.innerHTML = "<span style='color:red;'>Please enter a signal.</span>";
      return;
    }

    outputDiv.innerHTML = "Processing...";
    console.log("📡 Sending signal:", userInput);

    try {
      const response = await fetch("/api/signal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: userInput })
      });

      const data = await response.json();

      console.log("✅ Response received:", data);

      if (data.error) {
        outputDiv.innerHTML = `<span style="color:red;">${data.error}</span>`;
        return;
      }

      // Render structured output
      outputDiv.innerHTML = `
        <div class="output-block">
          <p><strong>SIGNAL:</strong> ${data.signal || "—"}</p>
          <p><strong>STATE:</strong> ${data.state || "—"}</p>
          <p><strong>DISTORTION:</strong> ${data.distortion || "—"}</p>
          <p><strong>RECOGNITION:</strong> ${data.recognition || "—"}</p>
          <p><strong>INSIGHT:</strong> ${data.insight || "—"}</p>
          <p><strong>NEXT BEST ACTION:</strong><br>${formatAction(data.action)}</p>
        </div>
      `;

    } catch (error) {
      console.error("❌ Fetch error:", error);
      outputDiv.innerHTML = "<span style='color:red;'>Error connecting to server.</span>";
    }
  });

  function formatAction(action) {
    if (!action) return "—";

    if (Array.isArray(action)) {
      return action.map((step, i) => `${i + 1}. ${step}`).join("<br>");
    }

    return action;
  }
});
