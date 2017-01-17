const mongoose  = require('mongoose');
const tfljourneySchema = new mongoose.Schema({
  name: {type: String},
  user: {type: mongoose.Schema.ObjectId, ref: 'User'},
  location: {type: [Number], required: true},
  orig: {type: [Number], required: true},  // [Long, Lat] backwards order to google
  destination: {type: [Number], required: true}, // [Long, Lat] backwards order to google
  text: String,
  created: {type: Date, default: Date.now},
  updated: {type: Date, default: Date.now}
});

from: {type: [Number], required: true},
// Origin of the journey (if in coordinate format then must be "longitude,latitude")

to:{type: [Number], required: true},
// Destination of the journey (if in coordinate format then must be "longitude,latitude")

via:{type: [Number], required: true},
//Travel through (if in coordinate format then must be "longitude,latidude")

national_search: {type: boolean, default: false},
// Does the journey cover stops outside London? eg. "nationalSearch=true". Set to false by default

date: {type: Date, default: Date.now},
//The date must be in yyyyMMdd format

//*time: {type:Time, default: Date.now},

//The time must be in HHmm format

time_is:
// Does the time given relate to arrival or leaving time? Possible options: "departing" | "arriving". Set to Departing by default

journey_preference: #=> The journey preference eg possible options: "leastinterchange" | "leasttime" | "leastwalking"

mode: #=> The mode must be a comma separated list of modes. eg possible options: "public-bus,overground,train,tube,coach,dlr,cablecar,tram,river,walking,cycle"

accessibility_preference: #=> The accessibility preference must be a comma separated list eg. "noSolidStairs,noEscalators,noElevators,stepFreeToVehicle,stepFreeToPlatform"

from_name: #=> From name is the location name associated with a from coordinate

to_name: #=> To name is the label location associated with a to coordinate

via_name: #=> Via name is the location name associated with a via coordinate

max_transfer_minutes: #=> The max walking time in minutes for transfer eg. "120"

min_transfer_minutes: #=> The max walking time in minutes for journeys eg. "120"

walking_speed: #=> The walking speed. eg possible options: "slow" | "average" | "fast"

cycle_preference: #=> The cycle preference. eg possible options: "allTheWay" | "leaveAtStation" | "takeOnTransport" | "cycleHire"

adjustment: #=> Time adjustment command. eg possible options: "TripFirst" | "TripLast"

bike_proficiency: #=> A comma separated list of cycling proficiency levels. eg possible options: "easy,moderate,fast"

alternative_cycle: #=> Set to True to generate an additional journey consisting of cycling only, if possible. Default value is false. eg. alternative_cycle: true

alternative_walking: #=> Set to true to generate an additional journey consisting of walking only, if possible. Default value is false. eg. alternative_walking: true

apply_html_markup: #=> Flag to





module.exports = mongoose.model('TFLJourney', tfljourneySchema);
