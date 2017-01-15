const mongoose = require('mongoose');

const tflSchema = mongoose.Schema({
  available: String,
  file: String,
  lat: String,
  lng: String,
  postcode: String,
  location: String

  //tfl
  
});

module.exports = mongoose.model('Camera', cameraSchema);
