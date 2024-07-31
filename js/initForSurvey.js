//Image Map Resizer-
!function(){"use strict";function r(){function e(){var r={width:u.width/u.naturalWidth,height:u.height/u.naturalHeight},a={width:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-left"),10),height:parseInt(window.getComputedStyle(u,null).getPropertyValue("padding-top"),10)};i.forEach(function(e,t){var n=0;o[t].coords=e.split(",").map(function(e){var t=1==(n=1-n)?"width":"height";return a[t]+Math.floor(Number(e)*r[t])}).join(",")})}function t(e){return e.coords.replace(/ *, */g,",").replace(/ +/g,",")}function n(){clearTimeout(d),d=setTimeout(e,250)}function r(e){return document.querySelector('img[usemap="'+e+'"]')}var a=this,o=null,i=null,u=null,d=null;"function"!=typeof a._resize?(o=a.getElementsByTagName("area"),i=Array.prototype.map.call(o,t),u=r("#"+a.name)||r(a.name),a._resize=e,u.addEventListener("load",e,!1),window.addEventListener("focus",e,!1),window.addEventListener("resize",n,!1),window.addEventListener("readystatechange",e,!1),document.addEventListener("fullscreenchange",e,!1),u.width===u.naturalWidth&&u.height===u.naturalHeight||e()):a._resize()}function e(){function t(e){e&&(!function(e){if(!e.tagName)throw new TypeError("Object is not a valid DOM element");if("MAP"!==e.tagName.toUpperCase())throw new TypeError("Expected <MAP> tag, found <"+e.tagName+">.")}(e),r.call(e),n.push(e))}var n;return function(e){switch(n=[],typeof e){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(e||"map"),t);break;case"object":t(e);break;default:throw new TypeError("Unexpected data type ("+typeof e+").")}return n}}"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&"object"==typeof module.exports?module.exports=e():window.imageMapResize=e(),"jQuery"in window&&(window.jQuery.fn.imageMapResize=function(){return this.filter("map").each(r).end()})}();
//# sourceMappingURL=imageMapResizer.map

// Initialize the map
let mapOptions = {
    "zoomRange":15, 
    "centerLatLong":[-117.5688863, 33.9168491]
}

//this will contain all the data from the survey
let allData = [];

let categorizedData = [];

const map = new maplibregl.Map({
    container: 'map', // container ID
    style: 'https://api.maptiler.com/maps/e2e0118b-79a2-4c4e-b331-fa09c59af068/style.json?key=vNy2aoqVADfzjG2R0VzQ', // Your style URL
    center: mapOptions.centerLatLong, // Starting position [lng, lat]
    zoom: mapOptions.zoomRange // Starting zoom level
});

function addMarker(data){
    let lng = data['lng'];
    let lat = data['lat'];
    let name = data["School Name"]
    let yearJoinedPR = data['What year did you join Project Rebound? '];
    let communitySupport = data['Do you feel your community has been supported in your post-incarceration life?'] + ', ' + data['Why do you feel this way about the support from your community? ']
    let viewOnEdu = data["Describe how your incarceration has impacted your view on education over time, if at all."]
    let title = data["Do you feel like enough post-incarcerated women are participating in education programs like Project Rebound?"];
    let message = data["Why do you feel this way about women's participation in post-incarceration educational programs?"];
    console.log(data)
    let category; 
    if(title == "Yes"){
        category = "Yes";
    }else if(title == "No"){
        category = "No";
    }else{
        category = "Unsure";
    }

    // add a new div element to hold the marker
    const newMarkerElement = document.createElement('div');

    // add a class to the marker element based on the category
    newMarkerElement.className = `marker marker-${category}`;

    // create a new marker using the marker element
    new maplibregl.Marker({element:newMarkerElement})
        .setLngLat([lng, lat])
        .addTo(map)
    console.log('lat, lng, name, yearJoinedPR,communitySupport, viewOnEdu');
    console.log(lat, lng, name, yearJoinedPR,communitySupport, viewOnEdu);
    createButtons(lat, lng, title, name, yearJoinedPR,communitySupport, viewOnEdu)
}

function createFilterUI() {
    // Remember! Make sure that the categories match the categories you used in the addMarker function!!!
    const categories = ['Yes', 'No','Unsure'];
    const filterGroup = document.getElementById('filter-group') || document.createElement('div');
    filterGroup.setAttribute('id', 'filter-group');
    filterGroup.className = 'filter-group'; // We are setting the class of the div element to 'filter-group' you can style this in CSS later!

    document.getElementById("pieChartButtons").appendChild(filterGroup);

    categories.forEach(category => {
        createCheckboxForCategory(category, filterGroup);
    });
}

function toggleMarkersVisibility(category, isVisible) {
    const markers = document.querySelectorAll(`.marker-${category}`);
    markers.forEach(marker => {
        marker.style.display = isVisible ? '' : 'none';
    });
}

function createCheckboxForCategory(category, filterGroup) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = category;
    input.checked = true;
    filterGroup.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', category);
    label.textContent = category;
    filterGroup.appendChild(label);

    input.addEventListener('change', function(event) {
        toggleMarkersVisibility(category, event.target.checked);
    });
}

function createButtons(lat, lng, title, name, joinedPR, communitySupport, viewOnEduShift){
    const newButton = document.createElement("button");
    newButton.innerHTML = name;
    newButton.setAttribute("lat",lat);
    newButton.setAttribute("lng",lng);

    if(title == "Yes"){
        newButton.style.background= "#ff2100";
    }else if(title == "No"){
        newButton.style.background = "#b31700";
    }else{
        newButton.style.background = "#FFBB78";
    }
    newButton.addEventListener('click', function(){
        map.flyTo({
            center: [lng,lat],
        })
        openNav();

        customizeSideBar(name, joinedPR, communitySupport, viewOnEduShift);
    })
    document.getElementById("contents").appendChild(newButton);
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUTyizJKXlwoFp1G2mjLl-Iw8rSgJ4MlIOTmP_0FHkRZf8I-tNeo-A73EnWE9iFm3lr4_woxnhBSFl/pub?output=csv";

// When the map is fully loaded, start adding GeoJSON data
map.on('load', function() {
    createFilterUI();
    // Use PapaParse to fetch and parse the CSV data from a Google Forms spreadsheet URL
    Papa.parse(dataUrl, {
        download: true, // Tells PapaParse to fetch the CSV data from the URL
        header: true, // Assumes the first row of your CSV are column headers
        complete: results => {
            // Process the parsed data
           console.log(results)
           processData(results.data)
           calculateResponses(results.data)
        }
    });
});

function processData(results){
    console.log(results) //for debugging: this can help us see if the results are what we want
    results.forEach(feature => {
        //console.log(feature) // for debugging: are we seeing each feature correctly?
        // assumes your geojson has a "title" and "message" attribute
        // let coordinates = feature.geometry.coordinates;
        addMarker(feature);
    });
};

function calculateResponses(results){
    let yesCount = 0;
    let noCount = 0;
    let notTooSureCount = 0;
    results.forEach(feature => {
        if(feature["Do you feel like enough post-incarcerated women are participating in education programs like Project Rebound?"] == "Yes"){
            yesCount++;
            return yesCount;
        }else if(feature["Do you feel like enough post-incarcerated women are participating in education programs like Project Rebound?"] == "No"){
            noCount++;
            return noCount;
        }else{
            notTooSureCount++;
        }
    });
}

//side bar
/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "700px";
    document.getElementById("main").style.marginRight = "250px";
}
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

function customizeSideBar(schoolName, joinedPR, communitySupport, viewOnEdu){

    const element = document.getElementById("schoolName");
    element.innerHTML = schoolName;

    const element1 = document.getElementById("joinedPR");
    element1.innerHTML = joinedPR;

    const element2 = document.getElementById("communitySupport");
    element2.innerHTML = communitySupport;

    const element3 = document.getElementById("viewOnEdu");
    element3.innerHTML = viewOnEdu;
}

map.addControl(new maplibregl.NavigationControl());


function hoverImageNo(){
    document.defaultImg.src="hoverNo.png"
}

function noHoverImageNo(){
    document.defaultImg.src="noHoverNo.png"
}

function hoverImageYes(){
    document.defaultImg.src="hoverYes.png"
}

function noHoverImageYes(){
    document.defaultImg.src="noHoverYes.png"
}

function hoverImageNotSure(){
    document.defaultImg.src="hoverNotSure.png"
}

function noHoverImageNotSure(){
    document.defaultImg.src="noHoverNotSure.png"
}

imageMapResize();
/*
//graph mouse events

const noSlice = document.getElementById("noSlice");
// This handler will be executed every time the cursor
// is moved over a different list item

noSlice.addEventListener('mouseover', () => {
    // highlight the mouseover target
   noSlice.src="hoverNo.png"
});

noSlice.addEventListener('mouseout', () => {
    // Change the button's background color back to its original color
    noSlice.src="noHoverNo.png"
});

const yesSlice = document.getElementById("yesSlice");
// This handler will be executed every time the cursor
// is moved over a different list item

yesSlice.addEventListener('mouseover', () => {
    // highlight the mouseover target
    yesSlice.src="hoverYes.png"
});

yesSlice.addEventListener('mouseout', () => {
    // Change the button's background color back to its original color
    yesSlice.src="noHoverYes.png"
});

const notSureSlice = document.getElementById("notSureSlice");
// This handler will be executed every time the cursor
// is moved over a different list item

notSureSlice.addEventListener('mouseover', () => {
    // highlight the mouseover target
    notSureSlice.src="hoverNotSure.png"
});

notSureSlice.addEventListener('mouseout', () => {
    // Change the button's background color back to its original color
    notSureSlice.src="noHoverNotSure.png"
});
*/