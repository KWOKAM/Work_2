let map;
let markers = [];
let movies = [];

function initMap() {
    // Création de la carte centrée sur San Francisco
    map = L.map('map').setView([37.7749, -122.4194], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Limiter la carte à la zone de San Francisco
    const sanFranciscoBounds = L.latLngBounds([
        [37.6398, -122.6283], // Sud-ouest
        [37.9298, -122.3283]  // Nord-est
    ]);
    map.setMaxBounds(sanFranciscoBounds);
    map.on('drag', function () {
        map.panInsideBounds(sanFranciscoBounds, { animate: false });
    });

    // Chargement des données des films 
    fetch('data/movies.json')
    .then(response => response.json())
    .then(data => {
        // Si data est déjà un tableau, on l'utilise directement.
        // Sinon, on vérifie si data possède une propriété qui contient le tableau.
        movies = Array.isArray(data) ? data : (data.movies || []);
        addMarkers(movies);
    })
    .catch(error => {
        console.error("Erreur lors du chargement des données :", error);
    });

}

function addMarkers(moviesArray) {
    moviesArray.forEach(movie => {
        if (movie.locations) {
            const marker = L.marker([movie.locations.lat, movie.locations.lng]).addTo(map);

            const contentString = `
                <b>${movie.title}</b><br>
                Année : ${movie.year}<br>
                Genre : ${movie.genre}<br>
                Acteurs : ${movie.actors}<br>
                Lieu : ${movie.locations.address}
            `;
            marker.bindPopup(contentString);
            markers.push(marker);
        }
    });
}

function displaySuggestions(filteredMovies) {
    suggestions.innerHTML = '';
    filteredMovies.slice(0, 5).forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.addEventListener('click', () => {
            searchInput.value = movie.title;
            suggestions.innerHTML = '';
            filterMap(movie.title);
        });
        suggestions.appendChild(li);
    });
}

function filterMap(title) {
    // Supprime tous les marqueurs
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    // Comparaison insensible à la casse pour filtrer
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase() === title.toLowerCase());
    addMarkers(filteredMovies);
}

// S'assurer que le DOM est entièrement chargé avant d'accéder aux éléments
document.addEventListener('DOMContentLoaded', () => {
    window.searchInput = document.getElementById('searchInput');
    window.suggestions = document.getElementById('suggestions');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(query));
        displaySuggestions(filteredMovies);
    });

    initMap();
});
