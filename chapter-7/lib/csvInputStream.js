import fs from 'node:fs'
import stream from 'node:stream'
import papaparse from 'papaparse'

export default function csvInputStream(inputFile) {
    const fileInputStream = fs.createReadStream(inputFile)
    const customReadable = new stream.Readable({ objectMode: true })
    customReadable._read = () => { }

    papaparse.parse(fileInputStream, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: ({ data: row }) => {
            customReadable.push(row)
        },
        complete: () => {
            customReadable.push(null)
        },
        error: (err) => {
            customReadable.emit('error', err)
        }
    })

    return customReadable
}
