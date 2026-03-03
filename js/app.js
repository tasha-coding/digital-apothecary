const herbListEl = document.getElementById("herb-list");



if (herbListEl) {
    const detailSection = document.getElementById("herb-detail");
    const listSection = herbListEl.parentElement;

    const nameEl = document.getElementById("herb-name");
    const categoriesEl = document.getElementById("herb-categories");
    const supportsEl = document.getElementById("herb-supports");
    const contraEl = document.getElementById("herb-contra");
    const synergyEl = document.getElementById("herb-synergy");
    const backButton = document.getElementById("back-button");

    herbs.forEach(herb => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="herb-link" data-name="${herb.name}">${herb.name}</a>`;
        herbListEl.appendChild(li);
    });
    // SEARCH FUNCTIONALITY
    const searchInput = document.getElementById("herb-search");

    function renderFilteredHerbs(filteredHerbs) {
        herbListEl.innerHTML = "";

        filteredHerbs.forEach(herb => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#" class="herb-link" data-name="${herb.name}">${herb.name}</a>`;
            herbListEl.appendChild(li);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();

            const filtered = herbs.filter(herb =>
                herb.name.toLowerCase().includes(query) ||
                herb.categories.some(cat => cat.toLowerCase().includes(query)) ||
                herb.supports.some(s => s.toLowerCase().includes(query)) ||
                herb.contraindications.some(c => c.toLowerCase().includes(query)) ||
                herb.synergy.some(sy => sy.toLowerCase().includes(query))
            );

            renderFilteredHerbs(filtered);
        });
    }

    document.addEventListener("click", e => {
        if (e.target.classList.contains("herb-link")) {
            e.preventDefault();
            const herbName = e.target.dataset.name;
            showHerbDetail(herbName);
        }
    });

    function showHerbDetail(name) {
        const herb = herbs.find(h => h.name === name);
        if (!herb) return;

        if (nameEl) nameEl.textContent = herb.name;
        if (categoriesEl) categoriesEl.textContent = herb.categories.join(", ");
        if (supportsEl) supportsEl.textContent = herb.supports.join(", ");
        if (contraEl) contraEl.textContent = herb.contraindications.length ? herb.contraindications.join(", ") : "None";
        if (synergyEl) synergyEl.textContent = herb.synergy.length ? herb.synergy.join(", ") : "None";

        if (listSection && detailSection) {
            listSection.style.display = "none";
            detailSection.style.display = "block";
        }
    }

    if (backButton) {
        backButton.addEventListener("click", () => {
            if (listSection && detailSection) {
                detailSection.style.display = "none";
                listSection.style.display = "block";
            }
        });
    }
} 