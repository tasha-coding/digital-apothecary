// REGISTER
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.onclick = async () => {
    
    const name = document.getElementById("registerName")?.value?.trim();
    const email = document.getElementById("registerEmail")?.value?.trim();
    const password = document.getElementById("registerPassword")?.value;
    const role = document.getElementById("registerRole")?.value || "user";

    
    if (!name || !email || !password) return;

    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("users").doc(userCred.user.uid).set({ name, email, role });
    window.location = "intake.html";
  };
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn)
  loginBtn.onclick = async () => {
    
    const email = document.getElementById("loginEmail")?.value?.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) return;

    const userCred = await auth.signInWithEmailAndPassword(email, password);
    const userDoc = await db.collection("users").doc(userCred.user.uid).get();

     if (userDoc.data()?.role === "admin") {
      window.location = "admin.html";
    } else {
      window.location = "intake.html";
    }
  };
