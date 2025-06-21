const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getCandidates } = require("./candidatesStore");

let running = false;
let interval = null;

function startTur1Thread() {
  if (running) return;
  running = true;
  interval = setInterval(async () => {
    const candidates = getCandidates();
    if (candidates.length === 0) return;
    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    const voterId = Math.random().toString(36).slice(2, 10);

    try {
      await prisma.voter.create({
        data: { id: voterId, voted: candidate.id }
      });
    } catch (e) {
      // Ignore duplicate or other errors
    }
  }, 300);
}

function stopTur1Thread() {
  if (interval) clearInterval(interval);
  interval = null;
  running = false;
}

function isTur1Running() {
  return running;
}

module.exports = { startTur1Thread, stopTur1Thread, isTur1Running };