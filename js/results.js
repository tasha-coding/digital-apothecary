// js/results.js
import { scoreHerbs } from "./recommendationEngine.js";

const params = new URLSearchParams(window.location.search);
const intakeId = params.get("intakeId");

const topEl = document.getElementById("top-results");
const safetyEl = document.getElementById("safety-results");
const subtitleEl = document.getElementById("subtitle");

async function loadHerbs() {
    const res = await fetch("../data/herb.json");
    if (!res.ok) throw new Error("Could not load ../data/herb.json");
    return await res.json();
}
results.html ? intakeId =...



// 2) Fallback: localStorage
const raw = localStorage.getItem("latestIntake");
return raw ? JSON.parse(raw) : null;


function render(scored, intake) {
    const goals = Array.isArray(intake?.goals) ? intake.goals.join(", ") : "";
    subtitleEl.textContent = goals ? `Based on your goals: ${goals}` : "Based on your intake.";

    const top = scored.safe.slice(0, 5);

    if (!top.length) {
        topEl.innerHTML = `<p>No safe matches found based on your flags/meds.</p>`;
    } else {
        topEl.innerHTML = top.map(r => `
      <div class="card" style="margin:0.75rem 0; background: rgba(171,173,150,0.75);">
        <h3 style="margin-top:0;">${r.herb.name} <span class="muted">(score: ${r.score})</span></h3>
        ${r.reasons?.length ? `<ul>${r.reasons.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
        ${r.synergy?.length ? `<p><strong>Pairs well with:</strong> ${r.synergy.slice(0, 3).join(", ")}</p>` : ""}
      </div>
    `).join("");
    }

    if (!scored.excluded.length) {
        safetyEl.innerHTML = `<p class="muted">No major contraindication flags detected from your answers.</p>`;
    } else {
        safetyEl.innerHTML = `
      <ul>
        ${scored.excluded.slice(0, 10).map(r =>
            `<li><strong>${r.herb.name}</strong> — flagged for: ${r.triggeredContra.join(", ")}</li>`
        ).join("")}
      </ul>
    `;
    }
}

(async function init() {
    try {
        const [herbs, intake] = await Promise.all([loadHerbs(), loadIntake()]);

        if (!intake) {
            topEl.innerHTML = `<p>No intake found. Please complete the intake form first.</p>`;
            safetyEl.innerHTML = "";
            return;
        }

        const scored = scoreHerbs(herbs, intake);
        render(scored, intake);
    } catch (e) {
        console.error(e);
        topEl.innerHTML = `<p>Could not load results. Check console.</p>`;
    }
})();