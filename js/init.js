// Initialize the map
const centerLatLong = [-117.27168114653144, 32.85006077929251]
const zoomRange = 15

let mapOptions = {
    "zoomRange":15, 
    "centerLatLong":[-117.27168114653144, 32.85006077929251]
}

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/winter-v2/style.json?key=vNy2aoqVADfzjG2R0VzQ', // Your style URL
    center: centerLatLong, // Starting position [lng, lat]
    zoom: zoomRange // Starting zoom level
});

function createButtons(latitude,longitude,title){
    const newButton = document.createElement("button"); 
    newButton.id = "button"+title; 
    newButton.innerHTML = title; 
    newButton.setAttribute("latitude",latitude); 
    newButton.setAttribute("longitude",longitude); 
    newButton.addEventListener('click', function(){
        map.flyTo({
            center: [longitude,latitude], 
        })
    })
    document.getElementById("contents").appendChild(newButton); 
}

function addMarker(latitude, longitude, title, message){
    new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new maplibregl.Popup()
            .setHTML((`<h3>${title}</h3><h4>${message}</h4>`))
            )
        .addTo(map)
    createButtons(latitude, longitude, title)
}

const ramenRests = [{'lat': 32.85006077929251, 'long': 117.27168114653144, 'name': 'Harumama', 'description': 'This is Harumama. They have cute character buns!'},
{'lat': 32.83323174065526, 'long': 117.15850617798843, 'name': 'Raki Raki', 'description': 'This is Raki Raki Ramen. They have mochi noodles in their ramen!'},
{'lat': 32.917481241854674, 'long': 117.14957958298702, 'name': 'Menya Ultra', 'description': 'This is Menya Ultra. They have excellent karage chicken!'}]

map.on('load', function() {
    console.log("Yay! The map is loaded!")
    fetch("map.geojson") //(1)! 
    .then(response => { //(2)! 
        return response.json(); //arrow gets rid of the function name and gives you just the data
        //you can then use those results in the next then function
    })
    .then(response =>{ //(3)!
        // do something with the data
        processData(response)
    });
});

function processData(data){
    console.log(data)
    data.features.forEach(feature =>{
        console.log(feature)
        let coordinates = feature.geometry.coordinates;
        let longitude = coordinates[0];
        let latitude = coordinates[1];
        let title = feature.properties.title;
        let message = feature.properties.message;
        addMarker(latitude,longitude,title,message);
    })
}
