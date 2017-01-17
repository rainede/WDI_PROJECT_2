const googleMaps = require('google-maps');
const config = require('../config/config');

googleMaps.load(function(google) {
    new google.maps.Map(el, options);
});

googleMaps.KEY = config.googleMapsAPIKey;

googleMaps.LIBRARIES = ['places'];

googleMaps.REGION = 'GB';

/*Unload google api
For testing purposes is good to remove all google objects and restore loader to its original state.

GoogleMapsLoader.release(function() {
    console.log('No google maps api around');
});*/

googleMaps.onLoad(function(google) {
    console.log('I just loaded google maps api');
});
