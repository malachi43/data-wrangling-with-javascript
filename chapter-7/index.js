//FOR CSV DATA
// import readCSVStream from './lib/csvInputStream.js'
// import convertTemperatureStream from './lib/transformStream.js'
// import writeCSVStream from './lib/csvOutputStream.js'

//FOR JSON DATA
import readJSONStream from './lib/inputJSONStream.js'
import convertTemperatureStream from './lib/transformStream.js'
import writeJSONStream from './lib/jsonWriteStream.js'

import { pipeline } from 'node:stream'


// const inputFile = './data/weather-stations.csv'
// const outputFile = './output/weather-transformed.csv'

const inputFile = './data/weather-stations.json'
const outputFile = './output/weather-transformed.json'

// pipeline(readCSVStream(inputFile), convertTemperatureStream(), writeCSVStream(outputFile), (err) => {
//     if (err) {
//         console.error('Error')
//         console.error(err.stack)
//     }
// })

pipeline(readJSONStream(inputFile), convertTemperatureStream(), writeJSONStream(outputFile), (err) => {
    if (err) {
        console.error('Error')
        console.error(err.stack)
    }
})
