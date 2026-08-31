// Node filesystem stream utilities
import { createWriteStream, statSync } from 'node:fs'
// Faker library to generate realistic fake data
import { faker } from '@faker-js/faker'
// Project constants: output file path and logging interval
import { LOG_FILE, LOG_INTERVAL } from './constants.js'

// Number of records to generate. Taken from the CLI argument or unlimited by default.
const maxRecords = Number(process.argv[2] || Infinity)

// Validate the provided `maxRecords` value. Exit with usage instructions if invalid.
if (
    (!Number.isInteger(maxRecords) && Number.isFinite(maxRecords)) ||
    Number.isNaN(maxRecords) ||
    maxRecords <= 0
) {
    console.error('Use: npm run seed -- <quantity>')
    console.error('The amount must be a whole number greater than zero.')
    process.exit(1)
}

// Create a writable stream to the target log file.
const stream = createWriteStream(LOG_FILE)

// Generate a mock user object with common profile fields.
function generateUser() {
    return {
        ip: faker.internet.ip(),
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        location: faker.location.city(),
        jobArea: faker.person.jobArea(),
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
    }
}

// Create a log entry by extending a user object with an id and timestamp.
function generateLogEntry(user) {
    return {
        ...user,
        id: faker.string.uuid(),
        timestamp: faker.date.recent.toString(),
    }
}

// Write a line to the stream and handle backpressure.
// If the internal buffer is full, wait for the 'drain' event before resolving.
function writeRecord(line) {
    return new Promise((resolve) => {
        if (!stream.write(line)) {
            stream.once('drain', resolve)
        } else {
            resolve()
        }
    })
}

function convertFromBytesToBG(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(4)
}

// Inform the user that log generation is starting.
console.log(
    `Generating fake access logs in ${LOG_FILE}... (Press Ctrl + C to stop)`,
)

console.log(`Record limit: ${maxRecords.toLocaleString()}`)

// Pre-generate a small pool of users and reuse them to vary log entries.
const users = Array.from({ length: 5 }, generateUser)

// Handle Ctrl+C (SIGINT) to gracefully close the stream and report progress.
process.on('SIGINT', () => {
    stream.end(() => {
        const { size } = statSync(LOG_FILE)

        console.log(
            `Generation interrupted! Records: ${count.toLocaleString()}, File size: ${convertFromBytesToBG(size)} GB`,
        )
    })
})

let count = 0

// Main generation loop: produce log entries until reaching `maxRecords`.
while (count < maxRecords) {
    const user = faker.helpers.arrayElement(users)
    const record = generateLogEntry(user)

    // Write each record as a newline-delimited JSON line.
    await writeRecord(JSON.stringify(record) + '\n')

    count++

    // Periodically report progress based on LOG_INTERVAL.
    if (count % LOG_INTERVAL === 0) {
        const { size } = statSync(LOG_FILE)

        console.log(
            `Records: ${count.toLocaleString()}, File size: ${convertFromBytesToBG(size)} GB`,
        )
    }
}

// Close the stream when finished and print a final summary.
stream.end(() => {
    const { size } = statSync(LOG_FILE)

    console.log(
        `Generation completed! Records: ${count.toLocaleString()}, File size: ${convertFromBytesToBG(size)} GB`,
    )
})
