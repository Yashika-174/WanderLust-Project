
let coordinate = listing.geometry.coordinates;

mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10, // starting zoom
});

console.log("COORDINATES", coordinate);


const el = document.createElement('div');
el.className = 'custom-marker';

// Add the FontAwesome icon to the element
el.innerHTML = '<i class="fa-solid fa-compass"></i>';

// Style the element to ensure it appears correctly on the map
el.style.fontSize = '30px'; // Adjust size as needed
el.style.color = 'red'; // Change color as needed
el.style.textAlign = 'center';
el.style.lineHeight = '30px'; // Adjust line height to match font size
el.style.width = '30px'; // Adjust width as needed
el.style.height = '30px'; // Adjust height as needed
el.style.display = 'flex';
el.style.justifyContent = 'center';
el.style.alignItems = 'center';



const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinate)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<div style="width: 150px; height: 80px;"><h4 style="display: inline; background: linear-gradient(to bottom, pink 50%, orange 50%);">${listing.location}</h4><br><p style="background-color:yellow;font-size:15px;font-weight:bold">Exact Location after booking</p></div>`))
    .addTo(map);
