import { auth, db } from "./firebase.js";
import { runHerbEngine } from "./herbEngine.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-btn");
const backBtns = document.querySelectorAll(".back-btn");
const progressFill = document.getElementById("progressFill");

let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  progressFill.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
}

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStep();
    }
  });
});

backBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });
});

updateStep();

document.getElementById("intakeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in.");
    return;
  }

  const formData = new FormData(e.target);
  const data = {};

  formData.forEach((value, key) => {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  data.timestamp = serverTimestamp();
  data.userId = user.uid;

  // 🌿 Basic scoring logic
  data.scores = {
    stressScore: Number(data.anxiety || 0) + Number(data.stresslevel || 0),
    gutScore: Number(data.bloating || 0),
    energyScore: Number(data.fatigue || 0),
    sleepScore: Number(data.sleepdisturb || 0)
  };

  try {
    await addDoc(collection(db, "intakes"), data);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error saving intake:", error);
  }
});