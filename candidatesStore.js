let candidates = [
  { id: 1, name: "Alice Johnson", party: "Green Party", photo: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, name: "Bob Smith", party: "Liberal Party", photo: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Carla Gomez", party: "Conservative Party", photo: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 4, name: "David Lee", party: "Socialist Party", photo: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, name: "Eva Brown", party: "Green Party", photo: "https://randomuser.me/api/portraits/women/5.jpg" },
  { id: 6, name: "Frank White", party: "Liberal Party", photo: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: 7, name: "Grace Kim", party: "Conservative Party", photo: "https://randomuser.me/api/portraits/women/7.jpg" },
  { id: 8, name: "Henry Patel", party: "Socialist Party", photo: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 9, name: "Isabel Rossi", party: "Green Party", photo: "https://randomuser.me/api/portraits/women/9.jpg" },
  { id: 10, name: "Jack Wilson", party: "Liberal Party", photo: "https://randomuser.me/api/portraits/men/10.jpg" }
];

module.exports = {
  getCandidates: () => candidates,
  setCandidates: (newList) => { candidates = newList; },
  pushCandidate: (candidate) => { candidates.push(candidate); }
};