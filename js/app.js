var extent = [5.42, 49.215, 6.571, 50.304]; // [minX, minY, maxX, maxY]
var imageLayerVisible = true; // Track the visibility of the image layer
var map;
var imageLayer;
var geocoder;

function updateImageOpacity(opacity) {
    // Update the opacity of the image layer
    imageLayer.setOpacity(opacity);
}

function updateImageExtent(newExtent) {
    extent = newExtent;
    // Create a new ol.source.ImageStatic with the updated extent
    var newImageSource = new ol.source.ImageStatic({
        url: 'lux_geology.png', // Replace with your image URL or path
        projection: 'EPSG:4326',
        imageExtent: extent
    });
    // Set the new source for the image layer
    imageLayer.setSource(newImageSource);
}

map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        (imageLayer = new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: 'data/lux_geology.png', // Replace with your image URL or path
                projection: 'EPSG:4326',
                imageExtent: extent
            }),
            opacity: 0.7 // Set the initial opacity (50% transparent)
        }))
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([6.1, 49.8]), // Centered in Luxembourg
        zoom: 6 // You can adjust the zoom level as needed
    })
});

var MULLERTHAL = [6.3075, 49.7904];
// Create a point feature at a specific coordinate
var point = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(MULLERTHAL)) // Set the coordinate of the point
});

// Style for the point (you can customize this)
var pointStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: 'red' }),
        stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
});

point.setStyle(pointStyle);

// Create a vector layer to display the point
var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [point]
    })
});

// Add the vector layer to the map
map.addLayer(vectorLayer);

// Initialize the OpenLayers Geocoder
geocoder = new Geocoder('nominatim', {
    provider: 'osm',
    lang: 'en-US',
    placeholder: 'Search for a location...',
    limit: 5,
    debug: false,
    autoComplete: true,
    keepOpen: true,
});

// Add the geocoder control to the map
map.addControl(geocoder);

// Handle geocoder result selection
geocoder.on('addresschosen', function(event) {
    var feature = event.feature;
    console.log(feature)
    var coordinates = feature.getGeometry().getCoordinates();
    map.getView().animate({
        center: coordinates,
        zoom: 10,
        duration: 1000,
    });
});

///////////////////
// EVENT LISTENERS
///////////////////

// Add a keydown event listener to the document
document.addEventListener('keydown', function(event) {
    if (event.key === 'g' || event.key === 'G') {
        // Toggle the visibility of the image layer
        imageLayerVisible = !imageLayerVisible;
        map.getLayers().getArray()[1].setVisible(imageLayerVisible);
    }
});
// Add an input event listener to the opacity slider
var opacitySlider = document.getElementById('opacitySlider');
opacitySlider.addEventListener('input', function() {
    var opacity = parseFloat(opacitySlider.value);
    updateImageOpacity(opacity);
});