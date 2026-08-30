import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { LOG_FILE } from './seed'
import { createDatabase } from './database'

// Create the database instance used to store the ingested records.
const database = createDatabase()

// Open the log file as a readable stream.
const fileStream = createReadStream(LOG_FILE)

// Create a line-by-line reader for the log file.
const readline = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
})

console.log(`Reading ${LOG_FILE} and ingesting into the database...`)

let count = 0
let record = ''

// Read the log file one line at a time.
for await (const line of readline) {
    // Ignore empty lines.
    if (!line.trim()) continue

    try {
        // Parse each line as JSON and keep the resulting object in memory.
        record = JSON.parse(line)
    } catch (_) {
        // Skip malformed lines without stopping the process.
        continue
    }
}
