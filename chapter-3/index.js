const { importJSONFile, exportJSONFile, exportCSVFile, importDataAsCsv } = require('./lib/file.js')
const filepath = './data/earthquakes.csv'
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
const csvurl = `https://earthquake.usgs.gov/fdsnws/event/1/query.csv`
const fs = require('fs')
const mongoose = require('mongoose')
const connectionString = 'mongodb://127.0.0.1:27017/earthquakes'
const EarthModel = require('./models/earthquakes.js')
// const app = express()
// const axios = require('axios')
// const PORT = 3001

