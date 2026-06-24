const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// ✅ Serve frontend (THIS FIXES YOUR ISSUE)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Root route fallback (important for Render)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ API route
app.post("/api/signal", (req, res) => {
  const input = req.body.input;

  // TEMP TEST RESPONSE (replace later with intelligence)
  res.json({
    signal: input,
    state: "Processing",
    distortion: "None detected",
    recognition: "System connected successfully",
    insight: "Your backend is now working correctly",
    nextAction: [
      "Confirm frontend loads",
      "Test multiple inputs",
      "Proceed to intelligence layer"
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
