const { openDatabase } = require('./lib/customStreams.js')
const connectionString = `mongodb://127.0.0.1:27017/ANALYSIS`
const getModel = require('./connectDB/connect.js')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const fs = require('node:fs')
const model = `Weather`

async function processData(model, skip, limit) {
    const Weather = getModel.model(model)
    const docs = await Weather.find().skip(skip).limit(limit)
    const text = `num of docs processed so far: ${docs.length}\n`
    fs.appendFileSync('output.txt', text)
    process.exit(0)
}


openDatabase(connectionString)
    .then(async () => {
        processData(model, argv.skip, argv.limit)
    })
    .catch(err => console.error(err.message))