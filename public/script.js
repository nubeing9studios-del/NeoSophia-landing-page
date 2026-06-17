const generateBtn = document.getElementById("generate");
const signalInput = document.getElementById("signalInput");
const output = document.getElementById("output");

generateBtn.addEventListener("click", async () => {
  const signal = signalInput.value.trim();

  if (!signal) {
    output.innerText = "Enter a signal.";
    return;
  }

  output.innerText = "Processing...";

  try {
    const response = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    });

    const data = await response.json();

    if (!data || !data.response) {
      output.innerText = "No response generated.";
      return;
    }

    output.innerText = data.response;

  } catch (error) {
    console.error(error);
    output.innerText = "Connection issue. Try again.";
  }
});
