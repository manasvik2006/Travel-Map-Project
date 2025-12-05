const apiKey = "e6df4e220693fb4c623d1d6056b0f5a2";  // ⚠️ visible in frontend

const map = L.map("map").setView([12.9, 77.6], 6);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
// const marker = L.marker([12.9, 77.6]).addTo(map);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20
}).addTo(map);


function showWeather(lat, lon, place = "") {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(d => {
      const temp = d.main.temp.toFixed(1);
      document.getElementById("info").innerHTML =
        `<b>${place || d.name}</b><br>🌡️ ${temp}°C<br>${d.weather[0].description}`;
      marker.setLatLng([lat, lon]);
      map.setView([lat, lon], 9);
    });
}

function search() {
  const city = document.getElementById("city").value;
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(d => showWeather(d.coord.lat, d.coord.lon, d.name))
    .catch(() => alert("City not found"));
}

map.on("click", e => showWeather(e.latlng.lat, e.latlng.lng));
showWeather(12.9, 77.6, "Bangalore");
