const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
    Year: Number,
    Month: Number,
    Day: Number,
    Precipitation: Number,
    MinTemp: Number,
    MaxTemp: Number,
    Snowfall: Number
})

weatherSchema.index({ Year: 1 })

module.exports = weatherSchema