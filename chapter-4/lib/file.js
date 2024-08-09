import fs from 'fs'
// import { dirname,join} from 'path'
// import { Buffer } from 'node:buffer'
// import { fileURLToPath } from 'url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

const filepath = '../records.bin'

function read(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

function parseBinaryData(binaryFile) {
    try {

        const buffer = fs.readFileSync(binaryFile)
        //returns a signed 32 bit integer
        const numOfRecords = buffer.readInt32LE(0)
        //32bits/8bits = 4bytes(multiples of 4 bytes)
        let bufferOffset = 4
        const records = []

        for (let recordIndex = 0; recordIndex < numOfRecords; ++recordIndex) {
            //returns a 64bit signed double(64bit)
            const time = buffer.readDoubleLE(bufferOffset)
            const record = {}
            record["Time"] = new Date(time)
            //64bit/8bits = 8bytes i.e we will read from the buffer in multiples of 8bytes.
            record['Latitude'] = buffer.readDoubleLE(bufferOffset + 8)
            record['Longitude'] = buffer.readDoubleLE(bufferOffset + 16)
            record['Depth_Km'] = buffer.readDoubleLE(bufferOffset + 24)
            record['Magnitude'] = buffer.readDoubleLE(bufferOffset + 32)

            bufferOffset += 8 * 5

            records.push(record)
        }

        if (fs.existsSync('./output.json')) {
            console.log('output.json already exists')
            console.log(records)
            return
        } else {
            fs.writeFileSync('./output.json', JSON.stringify(records, null, 4))
            console.log('output.json written to disk successfully')
        }

    } catch (error) {
        console.log(error.message)
    }


}

function convertToBinaryFile(file, locationToSaveFile) {
    if (file === undefined) {
        console.log('[ Function convertToBinaryFile ] requires a "file" argument.')
        return
    }
    if (locationToSaveFile === undefined) {
        console.log('[ Function convertToBinaryFile ] requires a "file location" argument.')
        return
    }
    try {

        const records = JSON.parse(fs.readFileSync(file, 'utf-8'))

        //4 = no of bytes to store the length of the array, 8 = the no of bytes needed to store a property-value in an object, 5 = the no of property-value to store and records.length being the no of records in object in the array.
        const bufferSize = 4 + (8 * 5 * records.length)
        let bufferOffset = 4
        const buffer = Buffer.alloc(bufferSize)
        buffer.writeInt32LE(records.length)

        for (let recordIndex = 0; recordIndex < records.length; ++recordIndex) {
            const record = records[recordIndex]
            const time = new Date(record.Time).getTime()
            buffer.writeDoubleLE(time, bufferOffset)
            bufferOffset += 8
            buffer.writeDoubleLE(record.Latitude, bufferOffset)
            bufferOffset += 8
            buffer.writeDoubleLE(record.Longitude, bufferOffset)
            bufferOffset += 8
            buffer.writeDoubleLE(record['Depth_Km'], bufferOffset)
            bufferOffset += 8
            buffer.writeDoubleLE(record.Magnitude, bufferOffset)
            bufferOffset += 8
        }

        if (fs.existsSync(locationToSaveFile)) {
            console.log(`File(relative path): ${locationToSaveFile} already exists.`)
            return
        } else {
            fs.writeFileSync(locationToSaveFile, buffer)
            console.log(`binary file written to disk at location(relative path): ${locationToSaveFile}`)
        }

    } catch (error) {
        console.log(error.message)
    }

}

// parseBinaryData(filepath)
export { read, convertToBinaryFile }