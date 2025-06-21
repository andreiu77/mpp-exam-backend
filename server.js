const express = require("express");
const cors = require("cors");
const authRouter = require("./auth");
const { getCandidates, setCandidates, pushCandidate } = require("./candidatesStore");
const { startThread, stopThread } = require("./thread");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

// GET all candidates
app.get("/candidates", (req, res) => {
  res.json(getCandidates());
});

// ADD candidate
app.post("/candidates", (req, res) => {
  const data = req.body;
  const candidates = getCandidates();
  const maxId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) : 0;
  const newCandidate = { ...data, id: maxId + 1 };
  pushCandidate(newCandidate);
  res.status(201).json(newCandidate);
});

// UPDATE candidate
app.put("/candidates", (req, res) => {
  const data = req.body;
  setCandidates(getCandidates().map(c => c.id === data.id ? data : c));
  res.json(data);
});

// DELETE candidate
app.delete("/candidates", (req, res) => {
  const { id } = req.body;
  setCandidates(getCandidates().filter(c => c.id !== id));
  res.json({ success: true });
});

// THREAD endpoints
app.post("/candidates/thread", (req, res) => {
  const { action } = req.body;
  if (action === "start") {
    startThread();
    res.json({ started: true });
  } else if (action === "stop") {
    stopThread();
    res.json({ stopped: true });
  } else {
    res.json({ running: false });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});