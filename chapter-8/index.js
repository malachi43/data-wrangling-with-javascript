const {
    readFileStream,
    openDatabase,
    mongodbWriteStream,
    initSchema,
    getDocs } = require('./lib/customStreams.js')
const stream = require('stream')
const { join } = require('path')
const connectionString = `mongodb://127.0.0.1:27017/ANALYSIS`
const filepath = join(__dirname, "data", "weather-stations.csv")
const mongoose = require('mongoose')

function writeFileToDatabaseInStreams(url) {
    return new Promise((resolve, reject) => {
        openDatabase(url)
            .then(() => {
                stream.pipeline(
                    readFileStream(filepath),
                    mongodbWriteStream(),
                    (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    }
                )
            })
    })

}
console.time('time taken to retrieved docs from database')
openDatabase(connectionString)
    .then(() => {
        return getDocs('Weather', 0, 12)
    })
    .then(() => {
        console.timeEnd('time taken to retrieved docs from database')

    })
    .catch(err => {
        console.log(`Error type: ${err && err.name || 'error'}\nReason for error: ${err.message}`)
        process.exit(1)
    })


// writeFileToDatabaseInStreams(connectionString)
//     .then(() => {
//         console.log(`file written to database.`)
//         process.exit(0)
//     })
//     .catch((err) => {
//         console.error(`Error\n`, err.message)
//     })

//     openDatabase(connectionString)
//     .then(()=>{

//     })
