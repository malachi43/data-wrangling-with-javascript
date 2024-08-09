import bfj from 'bfj'
import fs from 'fs'
import stream from 'node:stream'

export default function createJSONStream(inputFile) {
    const inputStream = fs.createReadStream(inputFile)
    const emitter = bfj.walk(inputStream)
    const jsonStream = new stream.Readable({ objectMode: true })
    jsonStream._read = () => { }

    let obj = null
    let Objprop = null

    emitter.on(bfj.events.array, () => {
        console.log('JSON stream starting...')
    })
    emitter.on(bfj.events.object, () => {
        obj = {}
    })
    emitter.on(bfj.events.property, (prop) => {
        Objprop = prop
    })

    let onValue = (value) => {
        obj[Objprop] = value
        Objprop = null
    }
    emitter.on(bfj.events.string, onValue)
    emitter.on(bfj.events.number, onValue)
    emitter.on(bfj.events.literal, onValue)
    emitter.on(bfj.events.endObject, () => {
        jsonStream.push(obj)
        obj = null
    })
    emitter.on(bfj.events.endArray, () => {
        console.log('JSON stream closing...')
        jsonStream.push(null)
    })
    emitter.on(bfj.events.error, (err) => {
        jsonStream.emit('error', err)
    })


    return jsonStream
}