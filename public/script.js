const input = document.querySelector("textarea");
const output = document.querySelector("#output");
const button = document.querySelector("#generate");

button.addEventListener("click", async () => {
  const signal = input.value.trim();

  if (!signal) {
    output.innerHTML = "Enter a signal first.";
    return;
  }

  // Show loading state
  output.innerHTML = "Processing...";

  try {
    const res = await fetch("/api/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ signal })
    });

    const data = await res.json();

    if (!data.response) {
      output.innerHTML = "No response received.";
      return;
    }

    // Format response cleanly
    output.innerHTML = `
      <div class="response-card">
        <pre>${data.response}</pre>
      </div>
    `;

  } catch (err) {
    console.error(err);
    output.innerHTML = "Connection error. Try again.";
  }
});
