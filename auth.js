const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const router = Router();
const prisma = new PrismaClient();

// Register
router.post("/register", async (req, res) => {
  const { id } = req.body;
  const existing = await prisma.voter.findUnique({ where: { id: id } });
  if (existing) {
    return res.status(400).json({ error: "Voter already exists" });
  }
  const voter = await prisma.voter.create({
    data: { id: id, voted: null }
  });
  res.json({ success: true, voter: { id: voter.id, voted: voter.voted } });
});

// Login
router.post("/login", async (req, res) => {
  const { id } = req.body;
  const voter = await prisma.voter.findUnique({ where: { id: id } });
  if (!voter) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ success: true, voter: { id: voter.id, voted: voter.voted } });
});

module.exports = router;