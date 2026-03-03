// js/recommendationEngine.js
function normalize(str) {
    return String(str || "").trim().toLowerCase();
}

function toArray(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
    return [];
}

export function scoreHerbs(herbs, intake) {
    const goals = toArray(intake?.goals).map(normalize);
    const meds = toArray(intake?.meds).map(normalize);
    const flags = intake?.flags || {};
    const symptoms = intake?.symptoms || {};

    const results = (herbs || []).map(h => {
        const supports = toArray(h.supports).map(normalize);
        const contra = toArray(h.contraindications || h.contra || []).map(normalize);
        const synergy = toArray(h.synergy).map(s => String(s).trim());

        const triggeredContra = [];

        // Flag-based (simple v1)
        if (flags.pregnant && contra.some(c => c.includes("preg"))) triggeredContra.push("pregnancy");
        if (flags.breastfeeding && contra.some(c => c.includes("breast"))) triggeredContra.push("breastfeeding");
        if (flags.highBP && contra.some(c => c.includes("blood pressure") || c.includes("hypertension")))
            triggeredContra.push("high blood pressure");

        // Med-based (simple contains)
        for (const med of meds) {
            if (!med) continue;
            if (contra.some(c => c.includes(med))) triggeredContra.push(`med: ${med}`);
        }

        const excluded = triggeredContra.length > 0;

        let score = 0;
        const reasons = [];

        for (const g of goals) {
            if (supports.includes(g)) {
                score += 10;
                reasons.push(`Supports ${g}`);
            }
        }

        for (const key of Object.keys(symptoms)) {
            const sev = Number(symptoms[key] || 0);
            if (sev > 0 && supports.includes(normalize(key))) {
                score += Math.min(10, sev);
                reasons.push(`Matches ${key} severity (${sev}/10)`);
            }
        }

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