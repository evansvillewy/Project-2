// Creating map object
var map = L.map("map", {
    center: [39.82, -98.58],
    zoom: 4.25
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: "pk.eyJ1IjoibWlsbGVydDEwMjMiLCJhIjoiY2s3emNybnl4MDRuYzNlc2JjbGhrYmgwZSJ9.siqcMK3WlgTkKkRokjRtRQ"
}).addTo(map);

d3.json('/state_data/accident')
    .then(function (json) {
        // console.log(json)
    
    var heatArray = [];
  
    for (var i = 0; i < json.length; i++) {
      var states = json[i];
  
      heatArray.push([states.lat, states.lon]);
      // console.log(heatArray[i]);
    };

  
    var heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 35
    }).addTo(map);
  
  });
  

	


