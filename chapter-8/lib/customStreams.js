const stream = require('stream')
const papaparse = require('papaparse')
const mongoose = require('mongoose')
const fs = require('fs')
const conn = require('../connectDB/connect')

function readStream(filepath) {
    const readFileStream = new stream.Readable({ objectMode: true })
    readFileStream._read = () => { }

    const fileStream = fs.createReadStream(filepath)
    papaparse.parse(fileStream, {
        header: true,
        dynamicTyping: true,
        step: ({ data }) => {
            readFileStream.push(data)
        },
        complete: () => {
            readFileStream.push(null)
        }
    })

    return readFileStream
}

async function openDatabase(url) {
    return mongoose.connect(url)
}



function batchRetrieval(collection, skipIndex, limitNo) {
    const SKIP = skipIndex * limitNo
    const LIMIT = limitNo

    const Weather = conn.model(collection)
    const query = { Year: { $gte: 2016 } }
    const projection = { Year: 1, Month: 1, Precipitation: 1, _id: 0 }
    const asc = { Year: -1 }
    return Weather.find(query).skip(SKIP).limit(LIMIT).select(projection).sort(asc)

}
let docCount = 0
let windowCount = 0
function readDocsFromDB(collection, skipIndex, limitNo) {
    return batchRetrieval(collection, skipIndex, limitNo)
        .then(docs => {
            if (docs.length > 0) {
                docCount += docs.length
                ++windowCount
                console.log(`docs retrieved so far: [${docCount}], windowTraverse: [${windowCount}], docs per window: [${docs.length}]`)
                console.log(docs)
                return readDocsFromDB(collection, skipIndex + 1, limitNo)

            } else {
                console.log(`file retrieval done.`)
            }
        })

}

function createMongodbOutputStream() {

    const writeStream = new stream.Writable({ objectMode: true })
    
    const Weather = conn.model('Weather')

    Weather.syncIndexes()

    writeStream._write = (chunk, encoding, callback) => {
        Weather.create(chunk)
            .then(() => {
                callback()
            })
            .catch(() => {
                callback(err)
            })
    }

    return writeStream
}


module.exports = {
    readFileStream: readStream,
    openDatabase,
    mongodbWriteStream: createMongodbOutputStream,
    getDocs: readDocsFromDB,
}
