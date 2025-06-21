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
app.get("/news", async (req, res) => {
  const news = await getNews();
  res.json(news);
});

let tur1Running = false;
let tur1Interval = null;
const { startTur1Thread, stopTur1Thread, isTur1Running } = require("./tur1Thread");

// Start/stop tur1 thread
app.post("/tur1/thread", (req, res) => {
  const { action } = req.body;
  if (action === "start" && !isTur1Running()) {
    startTur1Thread();
    return res.json({ started: true });
  }
  if (action === "stop" && isTur1Running()) {
    stopTur1Thread();
    return res.json({ stopped: true });
  }
  res.json({ running: isTur1Running() });
});

// Get tur1 results
app.get("/tur1/results", async (req, res) => {
  const candidates = getCandidates();
  // Get all voters
  const voters = await prisma.voter.findMany();
  // Count votes per candidate
  const counts = {};
  candidates.forEach(c => counts[c.id] = 0);
  voters.forEach(v => {
    if (v.voted !== null && counts[v.voted] !== undefined) counts[v.voted]++;
  });
  const results = candidates.map(c => ({
    id: c.id,
    name: c.name,
    party: c.party,
    votes: counts[c.id]
  }));
  results.sort((a, b) => b.votes - a.votes);
  res.json(results);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});