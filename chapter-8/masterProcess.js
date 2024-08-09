
const { spawn } = require('node:child_process')
const runAsyncParallel = require('async-await-parallel')
const { openDatabase } = require('./lib/customStreams.js')
const connectionString = `mongodb://127.0.0.1:27017/ANALYSIS`
const getModel = require('./connectDB/connect.js')
const { availableParallelism } = require('node:os')

function runSlave(skip, limit, processIndex) {
    return new Promise((resolve, reject) => {
        const args = ['childProcess.js', '--skip', skip, '--limit', limit]
        const childProcess = spawn('node', args)

        childProcess.on('close', code => {
            if (code === 0) {
                resolve()
            } else {
                reject(code)
            }
        })

        childProcess.on('error', (err) => {
            reject(err)
        })
    })


}

function processBatch(skip, limit, processIndex) {
    const docsToSkip = skip * limit
    return () => {
        return runSlave(docsToSkip, limit, processIndex)
    }
}

function parallelProcessing(docs) {
    console.log(`data processing in progress...`);
    const batch = 1000
    const maxProcess = availableParallelism()
    const numOfBatches = docs / batch
    const childProcesses = []

    for (let skipIndex = 0; skipIndex < numOfBatches; ++skipIndex) {
        childProcesses.push(processBatch(skipIndex, batch, skipIndex))
    }

    return runAsyncParallel(childProcesses, maxProcess)


}


openDatabase(connectionString)
    .then(async () => {
        const model = `Weather`
        const Weather = getModel.model(model)
        const totalDocs = await Weather.countDocuments()
        parallelProcessing(totalDocs)
            .then(() => {
                console.log(`ALL BATCH PROCESSING COMPLETED...`)
                process.exit(0)
            })
            .catch(err => {
                console.log(err.message)
            })
    })