// ==API== 
// External API URL is here. All data comes from this endpoint.
const API_BASE_URL = "https://api.le-systeme-solaire.net/rest/bodies/";

// DOM Elements (HTML elements ill work with)
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const planetName = document.getElementById('planet-name');
const stats = document.getElementById('stats');
const planets = document.querySelectorAll('.planet');
const tooltip = document.getElementById('tooltip');

// === FUNCTIONS ===
// Fetches planet stats (async/await makes this smoother)
// If there's a problem it logs an error
async function fetchPlanetStats(planet) {
    try {
        const response = await fetch(`${API_BASE_URL}${planet.toLowerCase()}`);
        if (!response.ok) throw new Error("Failed to fetch data."); // Handles invalid API calls
        const data = await response.json();

        // Updates the modal with data for the selected planet
        planetName.textContent = data.englishName || "Unknown Planet"; // Defaults to "Unknown Planet" if no name is available
        stats.innerHTML = `
            <p><strong>Mass:</strong> ${data.mass ? `${data.mass.massValue} × 10^${data.mass.massExponent} kg` : "Unknown"}</p>
            <p><strong>Temperature:</strong> ${data.avgTemp ? `${data.avgTemp} °C` : "Unknown"}</p>
            <p><strong>Gravity:</strong> ${data.gravity} m/s²</p>
            <p><strong>Orbital Period:</strong> ${data.sideralOrbit} days</p>
            <p><strong>Escape Velocity:</strong> ${data.escape || "Unknown"} m/s</p>
            <p><strong>Density:</strong> ${data.density || "Unknown"} g/cm³</p>
            <p><strong>Is a Moon:</strong> ${data.isPlanet ? "No" : "Yes"}</p>
            <p><strong>Axial Tilt:</strong> ${data.axialTilt || "Unknown"}°</p>
            <p><strong>Number of Moons:</strong> ${data.moons ? data.moons.length : "None"}</p>
            <p><strong>Type of Body:</strong> ${data.bodyType || "Unknown"}</p>
            <p><strong>Orbital Eccentricity:</strong> ${data.eccentricity || "Unknown"}</p>
            <p><strong>Perihelion Distance:</strong> ${data.perihelion ? `${data.perihelion} km` : "Unknown"}</p>
            <p><strong>Aphelion Distance:</strong> ${data.aphelion ? `${data.aphelion} km` : "Unknown"}</p>
        `;

        modal.style.display = "flex"; // // Makes sure the modal is visible to display the planet stats
    } catch (error) {
        console.error(error); // Logs the error to help for debugging purposes
        stats.textContent = "Uh-oh! 🚀 Something went wrong. Please try again later explorer!"; // Provides a user-friendly error message
    }
}

// === EVENTS ===
// Add hover + tooltip functionality for all planets
planets.forEach(planet => {
    planet.addEventListener('mouseover', async (e) => {
        const planetName = planet.getAttribute('data-planet'); // Gets the planet name from the custom data attribute
        tooltip.style.display = "block"; // Makes the tooltip visible when hovering
        tooltip.style.top = `${e.pageY}px`; // Position's the tooltip near the cursor (Y-axis)
        tooltip.style.left = `${e.pageX + 10}px`; // Slightly offset the tooltip to avoid overlap with the cursor

        try {
            const response = await fetch(`${API_BASE_URL}${planetName.toLowerCase()}`); // Fetches data for the hovered planet
            if (!response.ok) throw new Error("Failed to fetch data!"); // Handle API errors
            const data = await response.json();

            // Displays quick planet stats inside the tooltip
            tooltip.innerHTML = `
                <strong>${data.englishName}</strong><br>
                Radius: ${data.meanRadius} km<br>
                Gravity: ${data.gravity} m/s²
            `;
        } catch {
            tooltip.textContent = "Error fetching data!";  // Shows error in tooltip if fetch fails
        }
    });

    planet.addEventListener('mousemove', (e) => {
        // Updates tooltip position as the cursor moves
        tooltip.style.top = `${e.pageY}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
    });

    planet.addEventListener('mouseout', () => {
        tooltip.style.display = "none"; // Hide the tooltip when the cursor is not hovering over the planet
    });

    // On click it fetchs full planet details and shows them in a modal
    planet.addEventListener('click', () => {
        const planetName = planet.getAttribute('data-planet'); // Gets planet name from the custom attribute
        fetchPlanetStats(planetName); // Call function to fetch stats and display the modal
    });
});

// === MODAL ===
// Close the modal when the 'X' button is clicked
closeModal.addEventListener('click', () => {
    modal.style.display = "none"; // Hides the modal by setting display to "none"
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) { // Checks if the clicked area is the modal backdrop
        modal.style.display = "none"; // Closes the modal if the backdrop is clicked
    }
});

