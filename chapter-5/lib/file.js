
const fs = require('node:fs')
const axios = require('axios')
const papaparse = require('papaparse')


async function read(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}


async function readAsStream(filepath) {
    return new Promise((resolve, reject => {
        const readStream = fs.createReadStream(filepath, 'utf-8')
        let data = null
        readStream.on('data', (chunk) => {
            data += chunk
            console.log(data)
        })

        readStream.on('end', () => {
            resolve(data)
            readStream.destroy()
        })

        readStream.on('error', (err) => {
            console.error(`Error: ${err && err.message}`)
        })
    }))

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


function importDataAsCsv(filepath) {
    //NOTE: undefined is a property in the global object, while null is a variable.
    if (filepath === undefined) {
        return console.log(
            `[ Function importDataAsCsv ] requires a filepath argument but received ${filepath}`
        )
    }
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) return reject(err)
            const parsedFile = papaparse.parse(data,
                {
                    //let papaparse know that the CSV file contains a header row.
                    header: true,
                    //let papaparse infer the types.
                    dynamicTyping: true
                })
            resolve(parsedFile.data)
        })
    })
}


async function importCSVFromRestAPI(url) {
    const { data } = await axios.get(url)
    const result = papaparse.parse(data,
        {
            //let papaparse know that the CSV file contains a header row.
            header: true,
            //let papaparse infer the types.
            dynamicTyping: true
        })
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

function exportCSVFile(filename, data) {
    const serializedData = papaparse.unparse(data)
    return writeData(filename, serializedData)
}


module.exports = { read, readAsStream, importJSONFile, importFromRESTAPI, importDataAsCsv, importCSVFromRestAPI, writeData, exportJSONFile, exportCSVFile }