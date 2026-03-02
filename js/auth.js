function setAuthMessage(message, isError = false) {
  const el = document.getElementById("authMessage");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("error", isError);
}
// REGISTER
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.onclick = async () => {
    
    const name = document.getElementById("registerName")?.value?.trim();
    const email = document.getElementById("registerEmail")?.value?.trim();
    const password = document.getElementById("registerPassword")?.value;
    const role = document.getElementById("registerRole")?.value || "user";

    
if (!name || !email || !password) {
      setAuthMessage("Please complete all registration fields.", true);
      return;
    }
     try {
      setAuthMessage("Creating account...");
      const userCred = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(userCred.user.uid).set({ name, email, role });
      window.location = "intake.html";
    } catch (error) {
      setAuthMessage(error.message || "Registration failed.", true);
    }
  };
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
iif (loginBtn) 
  loginBtn.onclick = async () => {
    
     const email = document.getElementById("loginEmail")?.value?.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
      setAuthMessage("Please enter both email and password.", true);
      return;
    }


    if (!email || !password) return;

    try {
      setAuthMessage("Signing in...");
      const userCred = await auth.signInWithEmailAndPassword(email, password);
      const userDoc = await db.collection("users").doc(userCred.user.uid).get();

      if (userDoc.data()?.role === "admin") {
        window.location = "admin.html";
      } else {
        window.location = "intake.html";
      }
    } catch (error) {
      setAuthMessage(error.message || "Login failed.", true);
    }
  }
