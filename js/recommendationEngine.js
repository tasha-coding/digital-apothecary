// js/recommendationEngine.js
function normalize(str) {
    return String(str || "").trim().toLowerCase();
}

function arr(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
    return [];
}

// Intake model we expect:
// intake.goals: ["stress","sleep"]
// intake.symptoms: { stress: 7, sleep: 8, digestion: 2 ... } // 0-10
// intake.flags: { pregnant: false, breastfeeding: false, highBP: false, ... }
// intake.meds: ["warfarin", "ssri"] (optional)

export function scoreHerbs(herbs, intake) {
    const goals = arr(intake?.goals).map(normalize);
    const meds = arr(intake?.meds).map(normalize);
    const flags = intake?.flags || {};
    const symptoms = intake?.symptoms || {};

    const results = (herbs || []).map(h => {
        const supports = arr(h.supports).map(normalize);
        const contra = arr(h.contraindications || h.contra || []).map(normalize);
        const synergy = arr(h.synergy).map(s => String(s).trim());

        // --- Hard excludes (v1) ---
        const triggeredContra = [];

        // flag-based contra: match keys like "pregnancy", "breastfeeding", "high blood pressure"
        if (flags.pregnant && contra.some(c => c.includes("preg"))) triggeredContra.push("pregnancy");
        if (flags.breastfeeding && contra.some(c => c.includes("breast"))) triggeredContra.push("breastfeeding");
        if (flags.highBP && contra.some(c => c.includes("blood pressure") || c.includes("hypertension")))
            triggeredContra.push("high blood pressure");

        // meds-based contra: simple string contains
        for (const med of meds) {
            if (!med) continue;
            if (contra.some(c => c.includes(med))) triggeredContra.push(`med: ${med}`);
        }

        const excluded = triggeredContra.length > 0;

        // --- Score (v1) ---
        let score = 0;
        const reasons = [];

        for (const g of goals) {
            if (supports.includes(g)) {
                score += 10;
                reasons.push(`Supports ${g}`);
            }
        }

        // severity weighting: if symptom key matches a support, add symptom severity
        for (const key of Object.keys(symptoms)) {
            const sev = Number(symptoms[key] || 0);
            if (sev > 0 && supports.includes(normalize(key))) {
                score += Math.min(10, sev); // cap at 10
                reasons.push(`Matches ${key} severity (${sev}/10)`);
            }
        }

        // small bump for common “primary actions”
        if (supports.includes("adaptogen")) score += 2;

        return {
            herb: h,
            score: excluded ? 0 : score,
            excluded,
            triggeredContra,
            reasons: Array.from(new Set(reasons)),
            synergy
        };
    });

    const safe = results.filter(r => !r.excluded).sort((a, b) => b.score - a.score);
    const excluded = results.filter(r => r.excluded);

    return { safe, excluded };
}