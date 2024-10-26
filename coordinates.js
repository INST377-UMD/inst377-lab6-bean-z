/*
    Requires a library loaded from the internet using <script>.
    Makes web requests.
*/

const COORD_PRECISION = 3;
const LAT_FROM = 30;
const LAT_TO = 35;
const LNG_FROM = -100;
const LNG_TO = -90;

/**
 * Pure
 * Be careful if any argument is negative
 */
function getRandomInRange(from, to) {
    return from + (to - from) * Math.random();
}

async function makeAndShowCoords(precision) {
    const coords = [];
    for (let i = 0; i < 3; i++) {
        coords.push(L.latLng([getRandomInRange(LAT_FROM, LAT_TO), getRandomInRange(LNG_TO, LNG_FROM)]));
    }
    const localities = [];
    for (const c of coords) {
        localities.push(await fetchLocality(c.lat, c.lng));
    }
    showLocs(coords, localities, precision);
    const bounds = L.latLngBounds([LAT_FROM - 1, LNG_FROM - 1], [LAT_TO + 1, LNG_TO + 1]);
    const map = L.map("map"); // DOM true
    map.fitBounds(bounds);
    showMarkers(map, coords, localities, precision);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>` }
    ).addTo(map);
}

/**
 * DOM false
 */
function fetchLocality(lat, lng) {
    const request = new Request(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
    const response = fetch(request)
        .then(resp => resp.json())
        .then(location => [location["locality"], location["principalSubdivision"]]);
    return response;
}

function showLocs(coords, localities, precision) {
    for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const locality = localities[i];
        document.getElementById(`lat${i + 1}`).innerHTML = coord.lat.toFixed(precision);
        document.getElementById(`lng${i + 1}`).innerHTML = coord.lng.toFixed(precision);
        document.getElementById(`loc${i + 1}`).innerHTML = `${locality[0]}, ${locality[1]}`;
    }
}

function showMarkers(map, coords, localities, precision) {
    for (let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const locality = localities[i];
        const marker = L.marker(coord);
        marker.bindPopup(`${coord.lat.toFixed(precision)},${coord.lng.toFixed(precision)}<br>`
            + `${locality[0]}, ${locality[1]}`);
        marker.addTo(map);
    }
}

makeAndShowCoords(COORD_PRECISION);