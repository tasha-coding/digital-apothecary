// js/results.js
import { scoreHerbs } from "./recommendationEngine.js";

// Expect: ?intakeId=XXXX
const params = new URLSearchParams(window.location.search);
const intakeId = params.get("intakeId");

const topEl = document.getElementById("top-results");
const safetyEl = document.getElementById("safety-results");
const subtitleEl = document.getElementById("results-subtitle");

function cardHTML(title, body) {
    return `
    <div class="card" style="margin: 0.75rem 0; background: rgba(171,173,150,0.75);">
      <h3 style="margin-top:0;">${title}</h3>
      <div>${body}</div>
    </div>
  `;
}

async function loadHerbsData() {
    // You already use data/herb.json — keep consistent with your project.
    const res = await fetch("../data/herb.json");
    if (!res.ok) throw new Error("Could not load herb.json");
    return await res.json();
}

async function loadIntake(intakeId) {
    // If Firebase is set up, pull intake from Firestore.
    // If not, fall back to localStorage.
    if (window.firebase?.firestore && intakeId) {
        const db = firebase.firestore();
        const doc = await db.collection("intakes").doc(intakeId).get();
        if (doc.exists) return { id: doc.id, ...doc.data() };
    }
    const raw = localStorage.getItem("latestIntake");
    return raw ? JSON.parse(raw) : null;
}

function render({ safe, excluded }, intake) {
    const goals = (intake?.goals || []).join(", ");
    subtitleEl.textContent = goals ? `Based on your goals: ${goals}` : "Based on your intake answers.";

    const top = safe.slice(0, 5);
    if (top.length === 0) {
        topEl.innerHTML = "<p>No safe matches found with your current flags/meds. Consider reviewing contraindications.</p>";
    } else {
        topEl.innerHTML = top.map(r => {
            const reasons = r.reasons.length ? `<ul>${r.reasons.map(x => `<li>${x}</li>`).join("")}</ul>` : "";
            const synergy = r.synergy?.length ? `<p><strong>Pairs well with:</strong> ${r.synergy.slice(0, 3).join(", ")}</p>` : "";
            return cardHTML(
                `${r.herb.name} <span class="muted">(score: ${r.score})</span>`,
                `
          <p class="muted">${(r.herb.description || "").slice(0, 180)}${(r.herb.description || "").length > 180 ? "..." : ""}</p>
          ${reasons}
          ${synergy}
        `
            );
        }).join("");
    }

    // Safety notes: show excluded herbs (not recommended) with why
    if (!excluded.length) {
        safetyEl.innerHTML = "<p>No major contraindication flags detected from your answers.</p>";
    } else {
        const list = excluded.slice(0, 10).map(r => {
            const why = r.triggeredContra.join(", ");
            return `<li><strong>${r.herb.name}</strong> — flagged for: ${why}</li>`;
        }).join("");
        safetyEl.innerHTML = `<ul>${list}</ul>`;
    }
}

(async function init() {
    try {
        const [herbs, intake] = await Promise.all([loadHerbsData(), loadIntake(intakeId)]);
        if (!intake) {
            topEl.innerHTML = `<p>No intake found. Please complete the intake form first.</p>`;
            return;
        }
        const scored = scoreHerbs(herbs, intake);
        render(scored, intake);

        // Optionally save results to Firestore (if logged in)
        if (window.firebase?.auth && window.firebase?.firestore && intakeId) {
            const user = firebase.auth().currentUser;
            if (user) {
                await firebase.firestore().collection("results").add({
                    uid: user.uid,
                    intakeId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    topHerbs: scored.safe.slice(0, 5).map(r => ({
                        name: r.herb.name,
                        score: r.score,
                        reasons: r.reasons
                    })),
                    excluded: scored.excluded.slice(0, 10).map(r => ({
                        name: r.herb.name,
                        triggeredContra: r.triggeredContra
                    }))
                });
            }
        }
    } catch (e) {
        console.error(e);
        topEl.innerHTML = `<p>Could not load results. Check console.</p>`;
    }
})();
