import fs from 'node:fs'
import stream from 'node:stream'
import papaparse from 'papaparse'

export default function csvOutputStream(outputFile) {
    const outputFileStream = fs.createWriteStream(outputFile)
    const customWritable = new stream.Writable({ objectMode: true })
    let isHeader = true

    customWritable._write = (chunk, encoding, callback) => {
        const outputCSV = papaparse.unparse([chunk], {
            header: isHeader
        })
        outputFileStream.write(outputCSV + "\n")
        isHeader = false
        callback()
    }

    customWritable.on('finish', () => {
        outputFileStream.end()
    })

    return customWritable
}