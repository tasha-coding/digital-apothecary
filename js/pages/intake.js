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
  if (progressFill) {
    progressFill.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
  }
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

  // 1) Must be logged in
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to complete your assessment.");
    window.location.href = "register.html";
    return;
  }

  // 2) Build data from the form
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    // Handle multi-select / checkbox groups
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  // 3) Your scoring inputs (guard against missing fields)
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

  // Attach user + timestamp
  data.userId = user.uid;
  data.timestamp = serverTimestamp();

  try {
    // 4) Run herb engine
    const engineResults = await runHerbEngine(data);
    data.recommendations = engineResults;

    // 5) Save to Firestore
    const docRef = await addDoc(collection(db, "intakes"), data);

    // 6) Save locally too (useful fallback)
    localStorage.setItem(
      "latestIntake",
      JSON.stringify({ ...data, intakeId: docRef.id })
    );

    // 7) Redirect to results page with intakeId
    window.location.href = `results.html?intakeId=${encodeURIComponent(docRef.id)}`;

  } catch (error) {
    console.error("Error saving intake:", error);
    alert("Something went wrong saving your results.");
  }
});