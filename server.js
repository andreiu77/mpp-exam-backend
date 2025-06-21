const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authRouter = require("./auth");
const { getCandidates, setCandidates, pushCandidate } = require("./candidatesStore");
const { startThread, stopThread } = require("./thread");
const { startNewsThread, stopNewsThread, getNews } = require("./newsThread");


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

app.get("/voters", async (req, res) => {
  const voters = await prisma.voter.findMany();
  res.json(voters);
});

// GET /voter/:id
app.get("/voter/:id", async (req, res) => {
  const { id } = req.params;
  const voter = await prisma.voter.findUnique({ where: { id } });
  if (!voter) return res.status(404).json({ error: "Voter not found" });
  res.json(voter);
});

// POST /vote
app.post("/vote", async (req, res) => {
  const { voterId, candidateId } = req.body;
  // Check if voter exists and hasn't voted yet
  const voter = await prisma.voter.findUnique({ where: { id: voterId } });
  if (!voter) return res.status(404).json({ error: "Voter not found" });
  if (voter.voted !== null && voter.voted !== undefined)
    return res.status(400).json({ error: "You have already voted" });

  // Update the voter
  await prisma.voter.update({
    where: { id: voterId },
    data: { voted: candidateId }
  });
  res.json({ success: true });
});

// Start/stop news thread
app.post("/news/thread", (req, res) => {
  const { action } = req.body;
  if (action === "start") {
    startNewsThread();
    res.json({ started: true });
  } else if (action === "stop") {
    stopNewsThread();
    res.json({ stopped: true });
  } else {
    res.json({ running: !!getNews().length });
  }
});

// Get news
app.get("/news", (req, res) => {
  res.json(getNews());
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});