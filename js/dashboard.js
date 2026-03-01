import { auth, db } from "./firebase.js";
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("dashboardContent");

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const q = query(
    collection(db, "intakes"),
    where("userId", "==", user.uid),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    container.innerHTML = "<p>No intake found.</p>";
    return;
  }

  const data = snapshot.docs[0].data();
  const herbs = data.recommendations.topHerbs;
  const confidence = data.recommendations.confidence;

  let html = `
    <h2>🌿 Your Personalized Herbal Protocol</h2>
    <p>Confidence Level: <strong>${confidence}%</strong></p>
    <div class="herb-results">
  `;

  herbs.forEach(herb => {
    html += `
      <div class="herb-card">
        <h3>${herb.name}</h3>
        <p>Match Score: ${herb.score}</p>
        <p>Supports: ${herb.supports.join(", ")}</p>
      </div>
    `;
  });

  html += "</div>";

  container.innerHTML = html;
}); 