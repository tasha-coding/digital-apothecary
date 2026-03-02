// admin.js
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location = "register.html";
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.uid).get();
    if (doc.data()?.role !== "admin") {
      window.location = "intake.html";
      return;
    }

    const snapshot = await db.collection("intakes").get();
    let html = "<h2>All Intakes</h2>";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<p>User: ${data.userId} | Symptoms: ${(data.symptoms || []).join(", ")}</p>`;
    });

    if (snapshot.empty) {
      html = "<p>No intakes found.</p>"; // Add feedback for empty case
    }

    document.getElementById("adminResults").innerHTML = html;

  } catch (error) {
    console.error("Error fetching data: ", error);
    document.getElementById("adminResults").innerHTML = "<p>Error loading intakes. Please try again later.</p>";
  }
});
