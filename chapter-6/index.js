import { globby } from 'globby'
import { importCsvToJSON, exportJSONToCSVFile } from './lib/file.js'
import moment from 'moment'
import forge from 'data-forge'
import 'data-forge-fs'
import { join, dirname } from 'path/posix'
import { fileURLToPath } from 'url'
const inputFile = './data/surveys.csv'
const globpath = './data/by-country/*.csv'
const outputFile = './output/surveys-aggregated-data(country).csv'
const dateFormat = 'YYYY-MM-DDD HH:mm'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



// inputStream.on('data',(chunk)=>{
//  console.log(chunk)
// })




async function analyze(inputFile) {
    const content = await importCsvToJSON(inputFile)
    const output = transformData(content)
    exportJSONToCSVFile(outputFile, output)
}

function transformRow(row) {
    return parseDate(row, row.timezone)
}

function filterRow(row) {
    return row.country === 'Australia'
}

function transformData(inputData) {
    return inputData.map(transformRow)
}

function transformDataUsingDataForge(inputData) {
    //similar to javascript array map method.
    return inputData.select(transformRow)
}

function filterDataUsingDataForge(inputData) {
    //similar to javascript filter array method.
    return inputData.where(filterRow)
}

function removeColumnWithArray(row) {
    delete row.reef_type
    return { ...row }
}

function removeColumnWithDataForge(inputData) {
    return inputData.dropSeries('reef_type')
}



async function usingDataForge(inputData) {
    const dataFrame = (await forge.readFile(inputData).parseCSV()).parseFloats(["transects_length"])
    const data = transformDataUsingDataForge(dataFrame)
    const filteredData = filterDataUsingDataForge(data)
    const final = removeColumnWithDataForge(filteredData)
    const groupedData = final
        .groupBy(row => row.reef_name)
        .select(group => {
            return {
                REEF_NAME: group.first().reef_name,
                CUMULATIVE_TRANSECT_LENGTH: group.deflate(({ transects_length }) => {
                    return transects_length
                }).sum()
            }
        })
        .inflate()

    await groupedData.asCSV().writeFile(outputFile)
    console.log(`data successfully written.`)
}

// usingDataForge(inputFile)
//     .catch(err => console.log(err && err.message))

function parseDate(inputdate, utcOffset) {
    const start_datetime = moment(inputdate.start_datetime, dateFormat)
        .utcOffset(utcOffset)
        .toDate()
    const end_datetime = moment(inputdate.end_datetime, dateFormat)
        .utcOffset(utcOffset)
        .toDate()
    const result = { ...inputdate, start_datetime, end_datetime }
    return result
}

function filterByCountry(inputFrame, country) {
    return inputFrame.where((inputFrame) => inputFrame.country === country)
}

function getDistinctCountries(inputFrame) {
    return inputFrame.getSeries('country').distinct()
}

async function dataByCountry(inputFrame) {
    getDistinctCountries(inputFrame)
        .aggregate(Promise.resolve(), async (prevPromise, country) => {
            try {

                await prevPromise
                let filteredData = filterByCountry(inputFrame, country)
                const columns = filteredData.getColumnNames()
                filteredData = filteredData.dropSeries(columns.slice(13))
                const outputFile = join(__dirname, "output", "countries", `surveys-${country}.csv`)
                return await filteredData.asCSV().writeFile(outputFile)

            } catch (error) {
                console.log('Error')
                console.log(error.message)
            }
        })
}


// forge.readFile(inputFile)
//     .parseCSV()
//     .then(dataFrame => {
//         dataByCountry(dataFrame)
//     })
//     .catch(err => {
//         console.log('Error')
//         console.log(err.message)
//     })




// analyze(inputFile)
//     .catch(err => console.log(err && err.message))
