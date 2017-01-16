const mongoose  = require('mongoose');
const journeySchema = new mongoose.Schema({
    name: {type: String},
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    location: {type: [Number], required: true},
    orig:{type: [Number], required: true},  // [Long, Lat] backwards order to google
    destination: {type: [Number], required: true}, // [Long, Lat] backwards order to google
    text: String,
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Journey', journeySchema);
