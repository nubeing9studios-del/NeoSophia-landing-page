import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/signal", (req, res) => {
  const { signal } = req.body;

  if (!signal) {
    return res.status(400).json({ error: "No signal provided" });
  }

  // 🔥 CORE ENGINE (you can evolve this later)
  const response = {
    signal: "Stuck between vision and execution",
    state: "You have clarity of direction but lack structured implementation",
    distortion: "Overthinking and trying to solve everything at once",
    recognition: "The issue is not ability — it's lack of prioritisation",
    insight: "Clarity comes from reducing scope and acting on one defined step",
    actions: [
      "Choose ONE task that moves your project forward",
      "Complete it fully today",
      "Write the next 3 steps immediately after"
    ]
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
