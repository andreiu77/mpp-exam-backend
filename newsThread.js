const { faker } = require('@faker-js/faker');

let interval = null;
let news = [];

function startNewsThread() {
  if (interval) return;
  interval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      news.push({
        id: faker.string.uuid(),
        title: faker.lorem.words({ min: 2, max: 5 }),
        content: faker.lorem.words({ min: 5, max: 10 }),
        createdAt: new Date()
      });
    }
    // Keep only the latest 100 news
    if (news.length > 100) news = news.slice(-100);
  }, 1000);
}

function stopNewsThread() {
  if (interval) clearInterval(interval);
  interval = null;
}

function getNews() {
  return news;
}

export default { startNewsThread, stopNewsThread, getNews };