// Herb Data
const herbs = [
    {
        id: "lavender",
        name: "Lavender",
        category: "sleep",
        use: "Calming, sleep support",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
        description: "Lavender is commonly used to reduce anxiety and improve sleep quality."
    },
    {
        id: "peppermint",
        name: "Peppermint",
        category: "digestion",
        use: "Digestive aid",
        image: "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
        description: "Peppermint helps relieve bloating and digestive discomfort."
    },
    {
        id: "echinacea",
        name: "Echinacea",
        category: "immune",
        use: "Immune support",
        image: "https://images.unsplash.com/photo-1598887142487-ffab4a6c1a5e",
        description: "Echinacea is often used to support the immune system."
    },
    {
        id: "chamomile",
        name: "Chamomile",
        category: "sleep",
        use: "Relaxation",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
        description: "Chamomile tea is traditionally used to promote relaxation and sleep."
    }
];

// Elements
const herbList = document.getElementById("herb-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

// Display herbs on library page
function displayHerbs(filteredHerbs) {
    herbList.innerHTML = "";
    filteredHerbs.forEach(herb => {
        herbList.innerHTML += `
            <div class="card">
                <img src="${herb.image}" alt="${herb.name}">
                <h3>${herb.name}</h3>
                <p>${herb.use}</p>
                <a href="herb.html?id=${herb.id}" class="btn">Learn More</a>
            </div>
        `;
    });
}

if (herbList) {
    displayHerbs(herbs);

    searchInput?.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        const filtered = herbs.filter(herb =>
            herb.name.toLowerCase().includes(searchValue)
        );
        displayHerbs(filtered);
    });

    filterSelect?.addEventListener("change", () => {
        const value = filterSelect.value;
        if (value === "all") {
            displayHerbs(herbs);
        } else {
            displayHerbs(herbs.filter(herb => herb.category === value));
        }
    });
}

// Individual herb page
const herbDetail = document.getElementById("herb-detail");

if (herbDetail) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const herb = herbs.find(h => h.id === id);

    if (herb) {
        herbDetail.innerHTML = `
            <img src="${herb.image}" class="detail-img">
            <h1>${herb.name}</h1>
            <p><strong>Category:</strong> ${herb.category}</p>
            <p><strong>Primary Use:</strong> ${herb.use}</p>
            <p>${herb.description}</p>
        `;
    } else {
        herbDetail.innerHTML = "<p>Herb not found.</p>";
    }
}