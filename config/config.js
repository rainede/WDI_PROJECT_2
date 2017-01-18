// secret: "hush hush"
//
module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB_URI||  'mongodb://localhost/WDI_PROJECT_2',
  secret: process.env.SECRET || 'gosh this is so secret... shhh...',
  apiUrl: 'http://localhost:3000/api',
  //tflCameras: 'https://s3-eu-west-1.amazonaws.com/tfl.pub/Jamcams/jamcams-camera-list.xml'
  tflCameras: 'http://tfl.gov.uk/tfl/livetravelnews/trafficcams/cctv/',
  googleMapsAPIKey: process.env.GOOGLE || 'AIzaSyCS6aR9Ini0ffsm6TmMnX3u3GWRVTadsbI'
};
