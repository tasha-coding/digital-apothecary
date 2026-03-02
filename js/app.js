const herbListEl = document.getElementById("herb-list");
const detailSection = document.getElementById("herb-detail");
const listSection = document.getElementById("herb-list").parentElement;

const nameEl = document.getElementById("herb-name");
const categoriesEl = document.getElementById("herb-categories");
const supportsEl = document.getElementById("herb-supports");
const contraEl = document.getElementById("herb-contra");
const synergyEl = document.getElementById("herb-synergy");
const backButton = document.getElementById("back-button");

herbs.forEach(herb => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" class="herb-link" data-name="${herb.name}" aria-label="View details for ${herb.name}">${herb.name}</a>`;
    herbListEl.appendChild(li);
});

document.addEventListener("click", e => {
    if (e.target.classList.contains("herb-link")) {
        e.preventDefault();
        const herbName = e.target.dataset.name;
        showHerbDetail(herbName);
    }
});

function showHerbDetail(name) {
    const herb = herbs.find(h => h.name === name);
    if (!herb) {
        alert(`No details available for ${name}`);
        return;
    }

    nameEl.textContent = herb.name;
    categoriesEl.textContent = herb.categories.join(", ");
    supportsEl.textContent = herb.supports.join(", ");
    contraEl.textContent = herb.contraindications.length ? herb.contraindications.join(", ") : "None";
    synergyEl.textContent = herb.synergy.length ? herb.synergy.join(", ") : "None";

    listSection.style.display = "none";
    detailSection.style.display = "block";
}

backButton.addEventListener("click", () => {
    detailSection.style.display = "none";
    listSection.style.display = "block";
});

