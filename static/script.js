const map = L.map("map").setView([12.9141, 74.8560], 6);
const marker = L.marker([12.9141, 74.8560]).addTo(map);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(map);

const infoDiv = document.getElementById("info");

async function getJSON(url) {
  try {
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function showPlaceInfo(lat, lon) {
  infoDiv.innerHTML = "⏳ Loading information...";

  let placeName = "Unknown Place";
  let distanceKm = "N/A";
  let timeMin = "N/A";
  let cost = "N/A";

  const geoData = await getJSON(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
  );
  if (geoData && geoData.display_name) {
    placeName = geoData.display_name;
  }

  

  const routeData = await getJSON(
    `https://router.project-osrm.org/route/v1/driving/74.8560,12.9141;${lon},${lat}?overview=false`
  );
  if (routeData && routeData.routes && routeData.routes.length > 0) {
    const route = routeData.routes[0];
    distanceKm = (route.distance / 1000).toFixed(1);
    timeMin = (route.duration / 60).toFixed(1);
    cost = (distanceKm * 8).toFixed(2);
  }

  
  infoDiv.innerHTML = `
    <b>${placeName}</b><br>
     
    🚗 Distance: ${distanceKm} km<br>
    🕒 Travel Time: ${timeMin} minutes<br>
    💸 Estimated Cost: ₹${cost}
  `;

  marker.setLatLng([lat, lon]);
  map.setView([lat, lon], 8);
  

fetch("/save", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    place: placeName,
    distance: distanceKm,
    time: timeMin,
    cost: cost
  })
})
  .then(res => res.json())
  .then(data => {
      console.log(data.message);  
       alert(data.message);        
  });
}


document.getElementById("resetBtn").addEventListener("click", async () => {
    if (!confirm("Are you sure? All saved places will be deleted.")) return;

    const res = await fetch("/reset", { method: "POST" });

    const data = await res.json();
    alert(data.message);
});


map.on("click", (e) => {
  showPlaceInfo(e.latlng.lat, e.latlng.lng);
});

showPlaceInfo(12.9141, 74.8560);


























