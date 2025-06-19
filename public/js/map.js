mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from mapbox core's style. or make your own style with mapbox studio
  style: 'mapbox://styles/mapbox/standard', //style URL
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// Create a default Marker and add it to the map.
const el = document.createElement("div");
el.className = "marker";
el.innerHTML =
  '<i class="fa-solid fa-house"></i><i class="fa-solid fa-location-pin"></i>';

const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
  .setLngLat(coordinates) //listing.gemetry
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${roundLocation}</h4><p>Exact location will be provided after booking</p>`))
  .addTo(map);
