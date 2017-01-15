const rp       = require('request-promise');
const parser   = require('xml2json');
const mongoose = require('mongoose');
const Camera   = require('./config/config');
const config   = require('./models/camera');

mongoose.connect(config.db);

function saveCameras(response) {
  const json     = JSON.parse(parser.toJson(response));
  const cameras  = json.syndicatedFeed.cameraList.camera;
  let count    = 0;

  cameras.forEach(function(camera, index, cameras) {
    Camera.create({
      available: camera.available,
      file: camera.file,
      lat: camera.lat,
      lng: camera.lng,
      postcode: camera.postcode,
      location: camera.location
    }, function(){
      count++;
      console.log('Camera ' + count + ' downloaded.');
      if (count === cameras.length) return process.exit();
    });
  });
}

function getCameras(){
  Camera.collection.drop();

  const url = config.tflCameras;

  return rp(url)
    .then(saveCameras)
    .catch(function (err) {
      console.log('Something went wrong', err);
      process.exit();
    });
}
