function scrollToSection() {
  document.getElementById("loop").scrollIntoView({
    behavior: "smooth"
  });
}

function generateInsight() {
  const input = document.getElementById("signalInput").value;
  const output = document.getElementById("output");

  if (input.trim() === "") {
    output.innerText = "Please enter a signal first.";
    return;
  }

  output.innerText = "Analyzing...";

  setTimeout(() => {
    output.innerText =
      "Insight: You are experiencing cognitive tension. Focus on one clear action and reduce complexity.";
  }, 1000);
}
