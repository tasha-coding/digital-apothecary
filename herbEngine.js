export async function runHerbEngine(intakeData) {

  const response = await fetch("./data/herb.json");
  const herbs = await response.json();

  const scores = intakeData.scores;

  let results = herbs.map(herb => {
    let score = 0;

    // Weighted scoring
    herb.supports.forEach(area => {
      if (area === "stress") score += scores.stressScore || 0;
      if (area === "energy") score += scores.energyScore || 0;
      if (area === "sleep") score += scores.sleepScore || 0;
      if (area === "digestion") score += scores.gutScore || 0;
    });

    return {
      ...herb,
      score
    };
  });

  // Remove contraindications
  results = results.filter(herb => {
    if (intakeData.pregnancy === "Pregnant" &&
        herb.contraindications.includes("pregnancy")) {
      return false;
    }
    return true;
  });

  // Add synergy bonus
  results.forEach(herb => {
    herb.synergy.forEach(pair => {
      const pairedHerb = results.find(h => h.name === pair);
      if (pairedHerb && pairedHerb.score > 5) {
        herb.score += 2;
      }
    });
  });

  // Sort highest first
  results.sort((a, b) => b.score - a.score);

  const topHerbs = results.slice(0, 3);

  const confidence = Math.min(
    95,
    Math.round((topHerbs[0].score / 40) * 100)
  );

  return {
    topHerbs,
    confidence
  };
}