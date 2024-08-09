import fs from 'node:fs'
import stream from 'node:stream'

export default function customTransformStream() {
    const customTransform = new stream.Transform({ objectMode: true })
    customTransform._transform = (chunk, encoding, callback) => {
        const transformedChunk = tranformRow(chunk)
        customTransform.push(transformedChunk)
        callback()
    }

    return customTransform
}

function tranformRow(data) {
    let { MinTemp, MaxTemp } = data

    if (typeof MinTemp === 'number') {
        MinTemp /= 10
    } else {
        MinTemp = undefined
    }

    if (typeof MaxTemp === 'number') {
        MaxTemp /= 10
    } else {
        MaxTemp = undefined
    }


    return { ...data, MinTemp, MaxTemp }
}
