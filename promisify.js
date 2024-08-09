const fs = require('fs')

function readFilePromise(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf-8', (err, file) => {
            if (err) return reject(`Error: ${err.message}`)
            resolve(file)
        })
    })
}

module.exports = readFilePromise