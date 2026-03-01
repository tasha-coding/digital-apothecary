const submitBtn = document.getElementById("submitIntake");

submitBtn.onclick = async () => {
  const selected = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(cb=>cb.value);

  await db.collection("intakes").add({
    userId: auth.currentUser.uid,
    symptoms: selected,
    createdAt: new Date()
  });

  window.location="dashboard.html";
};