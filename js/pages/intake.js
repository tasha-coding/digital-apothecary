import { auth, db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { runHerbEngine } from "../herbEngine.js";

const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-btn");
const backBtns = document.querySelectorAll(".back-btn");
const progressFill = document.getElementById("progressFill");
const form = document.getElementById("intakeForm");

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
      window.scrollTo(0, 0);
    }
  });
});

backBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
      window.scrollTo(0, 0);
    }
  });
});

updateStep();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to complete your assessment.");
    return;
  }

  const formData = new FormData(form);
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

  const anxiety = Number(data.anxiety || 0);
  const stressLevel = Number(data.stresslevel || 0);
  const fatigue = Number(data.fatigue || 0);
  const bloating = Number(data.bloating || 0);
  const sleepDisturb = Number(data.sleepdisturb || 0);

  data.scores = {
    stressScore: anxiety + stressLevel,
    energyScore: fatigue,
    gutScore: bloating,
    sleepScore: sleepDisturb
  };

  const engineResults = await runHerbEngine(data);
  data.recommendations = engineResults;

  data.userId = user.uid;
  data.timestamp = serverTimestamp();

  try {
    await addDoc(collection(db, "intakes"), data);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error saving intake:", error);
    alert("Something went wrong saving your results.");
  }
});
