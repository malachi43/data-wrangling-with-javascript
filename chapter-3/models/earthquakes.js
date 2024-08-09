const mongoose = require('mongoose')

const earthquakeSchema = new mongoose.Schema({
    Time: {
        type: String,
        required: [true, 'Time field is required']
    },
    Latitude: {
        type: Number,
        required: [true, 'Latitude field is required']
    },
    Longitude: {
        type: Number,
        required: [true, 'Longitude field is required']
    },
    "Depth/Km": {
        type: Number,
        required: [true, 'Depth/km field is required']
    },
    Magnitude: {
        type: Number,
        required: [true, 'Magnitude field is required']
    },

})

const earthModel = mongoose.model('EarthModel', earthquakeSchema)

module.exports = earthModel