
import fs from 'fs'
import axios from 'axios'
import papaparse from 'papaparse'
import { dirname } from 'path'

async function read(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}


async function readAsStream(filepath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filepath, 'utf-8')
        let data = null
        readStream.on('data', (chunk) => {
            data += chunk
            // console.log(data)
        })

        readStream.on('end', () => {
            resolve(data)
            readStream.destroy()
        })

        readStream.on('error', (err) => {
            console.error(`Error: ${err.message}`)
            reject(err)
        })
    })

}

function importJSONFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
                return reject(err)
            }
            resolve(JSON.parse(data))
        })
    })
}


async function importFromRESTAPI(url) {
    try {
        const { data } = await axios.get(url)
        const earthquake = data.features.map(feature => {
            return { ...feature.properties, id: feature.id }
        })

        return earthquake

    } catch (error) {
        console.error(error.message)
    }

}


function importCsvToJSON(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) return reject(err)
            const parsedFile = papaparse.parse(data,
                {
                    //let papaparse know that the CSV file contains a header row.
                    header: true,
                    step: (row)=>{
                        console.log(`row of data: `, row.data)
                    },

                    //let papaparse infer the data-types.
                    dynamicTyping: true
                }
            )
            resolve(parsedFile.data)
        })
    })
}


async function importCsvToJSONFromAPI(url) {
    const { data } = await axios.get(url)
    const result = papaparse.parse(data,
        {
            //let papaparse know that the CSV file contains a header row.
            header: true,

            //let papaparse infer the data-types.
            dynamicTyping: true
        }
    )
    return result.data
}

function writeData(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(`data written successfully`)
            }
        })
    })
}

function exportJSONFile(filename, data) {
    const serializedData = JSON.stringify(data, null, 4)
    return writeData(filename, serializedData)
}

//NOTE: The "data" parameter must be in json format.
function exportJSONToCSVFile(filename, data) {


    mkdir(filename).catch(err => console.log(err && err.message))

    const serializedData = papaparse.unparse(data)
    return writeData(filename, serializedData)
}

function mkdir(path) {
    return new Promise((resolve, reject) => {
        try {

            let paths = path.split('/')

            paths = paths.slice(0, paths.length - 1)

            paths.reduce((parent, child) => {
                parent = `${parent}/${child}`
                fs.mkdirSync(parent)
                if (!fs.existsSync(parent)) {
                    parent = `${parent}/${child}`
                }
                return `${parent}`
            })
            resolve()
        } catch (error) {
            reject(error)
        }

    })

}


export { read, readAsStream, importJSONFile, importFromRESTAPI, importCsvToJSON, importCsvToJSONFromAPI, writeData, exportJSONFile, exportJSONToCSVFile }
