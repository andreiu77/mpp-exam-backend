const { getCandidates, pushCandidate } = require("./candidatesStore");

let interval = null;
let running = false;

function getRandomCandidate(existingCandidates) {
  const names = [
    "Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey", "Jamie", "Riley", "Drew", "Skyler"
  ];
  const surnames = [
    "Smith", "Johnson", "Lee", "Brown", "Garcia", "Martinez", "Kim", "Patel", "Nguyen", "Chen"
  ];
  const parties = [
    "Green Party", "Liberal Party", "Conservative Party", "Socialist Party"
  ];
  const gender = Math.random() < 0.5 ? "men" : "women";
  const num = Math.floor(Math.random() * 99) + 1;
  const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  const party = parties[Math.floor(Math.random() * parties.length)];
  const photo = `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
  const candidates = getCandidates();
  const maxId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) : 0;
  return {
    id: maxId + 1,
    name,
    party,
    photo
  };
}

function startThread() {
  if (running) return;
  running = true;
  interval = setInterval(() => {
    const candidate = getRandomCandidate(getCandidates());
    pushCandidate(candidate);
  }, 1000);
}

function stopThread() {
  if (!running) return;
  running = false;
  clearInterval(interval);
  interval = null;
}

module.exports = { startThread, stopThread };