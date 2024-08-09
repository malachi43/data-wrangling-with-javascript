

function generateReport(data) {
    const obj = Object.keys(data[0])

    return {
        columnNames: obj,
        numOfRows: data.length,
        numOfColumns: obj.length
    }
}

module.exports = generateReport