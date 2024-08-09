const forgeFS = require('data-forge-fs')
const formula = require('formulajs')

const filepath = './data/monthly_crashes-cut-down.csv'
const csvpath = './data/monthly_crashes_full.csv'


let count = 0
let isFirstCount = true
forgeFS.readFile(filepath)
    .parseCSV()
    .then(dataFrame => {

        const cnames = dataFrame.getColumnNames()

        const filteredCnames = cnames.filter(item => item !== 'Month')

        dataFrame = dataFrame.parseFloats(filteredCnames)

        //enables new column to be added to the dataFrame object.
        dataFrame.setIndex('Month#')

        const fatalitiesColumn = dataFrame
            //get data of the specified column.
            .getSeries('Fatalities')
        const fatalitiesForecast = fatalitiesColumn
            .rollingWindow(6)

            //select(map) run the transformation function for each sliding window and return an array of objects. [{},{},...]
            .select(window => {
                const fatalitiesValues = window.toArray()
                const indexes = window.getIndex().toArray()
                const nextMonthIndex = indexes[indexes.length - 1] + 1
                const forecast = Number(formula.FORECAST(nextMonthIndex, fatalitiesValues, indexes)).toFixed(3)

                return {
                    nextMonth: nextMonthIndex,
                    forecast
                }
            })

            //a function use to insert value at each index in the array retured  by the select(map) function.
            // .withIndex(obj => obj.nextMonth)

            //select(map) return an array containing the results returned by the transformation function.
            .select(window => window.forecast)

        //adds a new column with column name = 'Trends'
        const dataFrameWithSeries = dataFrame.withSeries({
            //The "key" is the column name while the "value(s) in most cases are arrays([])" are the column data.
            EARTHQUAKE_TRENDS: fatalitiesForecast
        })


        // const fileName = 'output_with_trend.csv'
        const fileName = 'EARTHQUAKE_TRENDS.csv'


        return dataFrameWithSeries
            .asCSV()
            .writeFile(fileName)
            .then(() => console.log(`data written to: ${fileName}`))
    })
    .catch(err => console.log(`Error: ${err && err.message}`))
