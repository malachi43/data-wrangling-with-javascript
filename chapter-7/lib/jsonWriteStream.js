import bfj from 'bfj'
import { json } from 'express'
import fs from 'fs'
import stream from 'node:stream'


export default function jsonWriteStream(outputFile) {
    const outputFileStream = fs.createWriteStream(outputFile)
    const jsonOuputStream = new stream.Writable({ objectMode: true })
    let objCount = 0
    outputFileStream.write("[")

    jsonOuputStream._write = (chunk, _, callback) => {
        if (objCount > 0) {
            outputFileStream.write(",")
        }
        const json = JSON.stringify(chunk, null, 4)
        outputFileStream.write(json)
        if (chunk) {
            ++objCount
        }
        callback()
    }

    jsonOuputStream.on("finish", () => {
        outputFileStream.write("]")
        outputFileStream.end()
    })

    return jsonOuputStream
}