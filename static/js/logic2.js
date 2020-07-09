API_KEY = "pk.eyJ1IjoiYXNocmMyMCIsImEiOiJja2J2Zm9tcWMwNWp3MndwYzFqem94czM0In0.kyKNT5nuxIcKuwKe_t_PVQ";


// Earthquakes query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Define Variables for base layer
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
});

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var markers = [];

  // Grab the data with d3
d3.json(queryUrl, function(response) {
    // console.log("Entering grabbing the data with D3");
    // Create a new marker cluster group
    createFeatures(data.features);
}

    // Define getColor function
    function getColor(d) {
        return d < 1  ? "#55FF00" :
               d >= 1 && d < 2  ? "#ECFF00" :
               d >= 2 && d < 3 ? "#FFD800" :
               d >= 3 && d < 4 ? "#FF9E00" :
               d >= 4 && d < 5 ? "#FF6800" :
                            "#FF0000";
    }
  
    // Loop through data
    for (var i = 0; i < response.features.length; i++) {
        // console.log(response.features[i].geometry.coordinates);
      // Set the data location property to a variable
      var location = response.features[i].geometry.coordinates.slice(0,2);

        // console.log("Entering Check for location property");
        // Add a new marker to the cluster group and bind a pop-up
        var cirHolder = L.circleMarker([location[1], location[0]], {
            stroke: false,
            fillOpacity: .75,
            color: getColor(response.features[i].properties.mag),
            fillColor: getColor(response.features[i].properties.mag),
            radius: response.features[i].properties.mag*3
        }).bindPopup("Location: "+response.features[i].properties.place+"\n"+"Mag: "+response.features[i].properties.mag);

        markers.push(cirHolder);

    }
    
    // Adding Legend
    // var legend = L.control({position: 'topright'});
    // legend.onAdd = function() {
    //     var div = L.DomUtil.create('div', 'info legend');
    //     labels = ['<strong>Magnitude</strong>'],
    //     categories = ['0-1','1-2','2-3','3-4','4-5',"5+"];

    //     for (var i = 0; i < categories.length; i++) {
    //         div.innerHTML += 
    //         labels.push(
    //             '<i class="circle" style="background:' + getColor(i) + '"></i> ' +
    //         (categories[i] ? categories[i] : '+'));
    //     }
    //     div.innerHTML = labels.join('<br>');
    //     return div;
    // };
    // legend.addTo(myMap);
});

// Create layer groups
var earthquakes  = L.layerGroup(markers);

// Create a baseMaps object
var baseMaps = {
    "Light Map": lightMap,
    "Dark Map": darkMap,
    "Satellite": satelliteMap
};

// Create overlay object
var overlayMaps = {
    "Earthquakes": earthquakes
};

var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 3,
    layers: [lightMap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);