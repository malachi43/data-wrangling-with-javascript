const mongoose = require('mongoose')
const weatherSchema = require('../schemas/weather')

function initializeConnection() {
    const conn = mongoose.model('Weather', weatherSchema)
    return conn
}

module.exports = initializeConnection()