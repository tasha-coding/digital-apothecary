// admin.js
auth.onAuthStateChanged(async user=>{
  if(!user) return;
  const doc = await db.collection("users").doc(user.uid).get();
  if(doc.data().role!=="admin") window.location="intake.html";

  const snapshot = await db.collection("intakes").get();
  let html="<h2>All Intakes</h2>";
  snapshot.forEach(doc=>{
    const data = doc.data();
    html+=`<p>User: ${data.userId} | Symptoms: ${data.symptoms.join(", ")}</p>`;
  });
  document.getElementById("adminResults").innerHTML=html;
});