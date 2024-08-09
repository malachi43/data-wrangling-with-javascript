import { parseCustomData } from "./utils/parseCustomData.js"
import { read, convertToBinaryFile } from './lib/file.js'
const filepath = './data/earthquakes.txt'
const file = './lib/output.json'
const binLocation = './earthquakeRecord.bin'

// read(filepath)
//     .then(data => {
//         return parseCustomData(data)
//     })
//     .then(result => {
//         console.log(result)
//     })

convertToBinaryFile(file,binLocation)
