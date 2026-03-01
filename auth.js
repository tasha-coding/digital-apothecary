// REGISTER
const registerBtn = document.getElementById("registerBtn");
if(registerBtn){
  registerBtn.onclick = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const userCred = await auth.createUserWithEmailAndPassword(email,password);
    await db.collection("users").doc(userCred.user.uid).set({ name,email,role });
    window.location = "intake.html";
  };
}

// LOGIN
const loginBtn = document.getElementById("loginBtn");
if(loginBtn){
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCred = await auth.signInWithEmailAndPassword(email,password);
    const userDoc = await db.collection("users").doc(userCred.user.uid).get();

    if(userDoc.data().role==="admin"){
      window.location="admin.html";
    } else {
      window.location="intake.html";
    }
  };
}