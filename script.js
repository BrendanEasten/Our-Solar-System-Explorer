// === ASYNCHRONOUS PROGRAMMING ===
// - API URL is here. All data comes from this endpoint.
const API_BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies/";

// DOM Elements (HTML elements we'll work with)
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const planetName = document.getElementById('planet-name');
const stats = document.getElementById('stats');
const planets = document.querySelectorAll('.planet');
const tooltip = document.getElementById('tooltip');

// === FUNCTIONS ===
// Fetches planet stats (async/await makes this smoother)
// If there's a problem, it logs an error (super helpful for debugging).
async function fetchPlanetStats(planet) {
    try {
        const response = await fetch(`${API_BASE_URL}${planet.toLowerCase()}`);
        if (!response.ok) throw new Error("Failed to fetch data."); // Catches bad API calls
        const data = await response.json();

        // Updates modal content with the data
        planetName.textContent = data.englishName || "Unknown Planet";
        stats.innerHTML = `
            <p><strong>Mass:</strong> ${data.mass ? `${data.mass.massValue} × 10^${data.mass.massExponent} kg` : "Unknown"}</p>
            <p><strong>Radius:</strong> ${data.meanRadius} km</p>
            <p><strong>Gravity:</strong> ${data.gravity} m/s²</p>
            <p><strong>Orbital Period:</strong> ${data.sideralOrbit} days</p>
        `;

        modal.style.display = "flex"; // Opens modal after fetching
    } catch (error) {
        console.error(error);
        stats.textContent = "Error fetching data. Please try again later."; // Shows error in the modal
    }
}

// === EVENTS ===
// Add hover + tooltip functionality for all planets
planets.forEach(planet => {
    planet.addEventListener('mouseover', async (e) => {
        const planetName = planet.getAttribute('data-planet');
        tooltip.style.display = "block"; // Show tooltip
        tooltip.style.top = `${e.pageY}px`;
        tooltip.style.left = `${e.pageX + 10}px`;

        try {
            const response = await fetch(`${API_BASE_URL}${planetName.toLowerCase()}`);
            if (!response.ok) throw new Error("Failed to fetch data.");
            const data = await response.json();

            // Fill tooltip with quick planet data
            tooltip.innerHTML = `
                <strong>${data.englishName}</strong><br>
                Radius: ${data.meanRadius} km<br>
                Gravity: ${data.gravity} m/s²
            `;
        } catch {
            tooltip.textContent = "Error fetching data.";
        }
    });

    planet.addEventListener('mousemove', (e) => {
        tooltip.style.top = `${e.pageY}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
    });

    planet.addEventListener('mouseout', () => {
        tooltip.style.display = "none"; // Hide tooltip when not hovering
    });

    // On click, show planet details in the modal
    planet.addEventListener('click', () => {
        const planetName = planet.getAttribute('data-planet');
        fetchPlanetStats(planetName); // Fetch stats and show modal
    });
});

// === MODAL ===
// Close modal when the 'X' is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Close modal when clicking outside it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});