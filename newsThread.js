const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getCandidates } = require('./candidatesStore');

let interval = null;

function startNewsThread() {
  if (interval) return;
  interval = setInterval(async () => {
    const candidates = getCandidates();
    if (candidates.length === 0) return;
    for (let i = 0; i < 3; i++) {
      const candidate = candidates[Math.floor(Math.random() * candidates.length)];
      const prefix = Math.random() < 0.5 ? "THE CHANGE" : "BETTER FUTURE";
      const title = `${prefix} ${candidate.name}`;
      const content = faker.lorem.words({ min: 5, max: 10 });
      try {
        await prisma.news.create({
          data: {
            id: faker.string.uuid(),
            title,
            content,
            createdAt: new Date()
          }
        });
      } catch (e) {
        // Handle error if needed
      }
    }
    // Optionally, delete old news if you want to keep only the latest 100
    const count = await prisma.news.count();
    if (count > 100) {
      const toDelete = await prisma.news.findMany({
        orderBy: { createdAt: 'asc' },
        take: count - 100,
        select: { id: true }
      });
      await prisma.news.deleteMany({
        where: { id: { in: toDelete.map(n => n.id) } }
      });
    }
  }, 1000);
}

function stopNewsThread() {
  if (interval) clearInterval(interval);
  interval = null;
}

async function getNews() {
  return await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

module.exports = { startNewsThread, stopNewsThread, getNews };