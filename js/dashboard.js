const herbDB = [
  {name:"Ashwagandha", supports:["stress","tired","anxiety"]},
  {name:"Rhodiola", supports:["stress","tired"]},
  {name:"Chamomile", supports:["stress","digestive","anxiety"]},
  {name:"Peppermint", supports:["digestive"]},
  {name:"Lavender", supports:["stress","anxiety"]},
  {name:"Echinacea", supports:["immune"]}
];

const synergyPairs = [
  {herbs:["Ashwagandha","Rhodiola"], reason:"Adaptogen stack for stress + energy."},
  {herbs:["Chamomile","Lavender"], reason:"Calming synergy."},
  {herbs:["Peppermint","Ginger"], reason:"Digestive support pairing."}
];

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location = "register.html";
    return;
  }

  const snapshot = await db.collection("intakes")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    document.getElementById("results").innerHTML = "<p>No intake found yet. Please complete the intake form first.</p>";
    return;
  }

  const symptoms = snapshot.docs[0].data().symptoms;

  let scored = herbDB.map(h => {
    let score = 0;
    symptoms.forEach(s => { 
      if (h.supports.includes(s)) 
        score += 2; 
    });
    return {...h, score};
  });

  scored.sort((a, b) => b.score - a.score);

  const activeHerbs = scored.filter(h => h.score > 0).map(h => h.name);
  const foundPairs = synergyPairs.filter(pair => 
    activeHerbs.includes(pair.herbs[0]) && activeHerbs.includes(pair.herbs[1])
  );

  let html = "<h2>Recommended Herbs</h2>";
  scored.filter(h => h.score > 0).forEach(h => {
    html += `<p><strong>${h.name}</strong> (Score: ${h.score})</p>`;
  });

  if (foundPairs.length) {
    html += "<h3>Complementary Pairings</h3>";
    foundPairs.forEach(p => {
      html += `<p>${p.herbs.join(" + ")} - ${p.reason}</p>`;
    });
  }

  if (html === "<h2>Recommended Herbs</h2>") {
    html += "<p>No direct matches found for your selected symptoms yet.</p>";
  }

  document.getElementById("results").innerHTML = html;
});
