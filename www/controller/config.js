// Config.js
// author: David Kukacka
// File to store neccessary configurational variable 



/* --------------------   Endpoint for deployd  ----------------------------- */

// For phone - depends on current device IP address
var deploydEndpoint = 'http://192.168.1.157:2403'
//var deploydEndpoint = 'http://172.20.10.3:2403';

//For localhost
//var deploydEndpoint = 'http://localhost:2403';

//For HEROKU
//var deploydEndpoint = 'http://localhost:2403'

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.camera);
}