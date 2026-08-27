import { createWriteStream, statSync } from 'node:fs'
import { faker } from '@faker-js/faker'

const LOG_FILE = 'access.log'
const LOG_INTERVAL = 1000
const maxRecords = Number(process.argv[2] || Infinity)

if (
    (!Number.isInteger(maxRecords) && Number.isFinite(maxRecords)) ||
    Number.isNaN(maxRecords) ||
    maxRecords <= 0
) {
    console.error('Use: npm run seed -- <quantity>')
    console.error('The amount must be a whole number greater than zero.')
    process.exit(1)
}

const stream = createWriteStream(LOG_FILE)

function generateUser() {
    return {
        ip: faker.internet.ip(),
        username: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        location: faker.location.city(),
        jobArea: faker.name.jobArea(),
        company: faker.company.name(),
        jobTitle: faker.name.jobTitle(),
        id: faker.string.uuid(),
    }
}

function generateLogEntry(user) {
    return {
        ...user,
        timestamp: faker.date.recent.toString(),
    }
}

// Backpressure implementation
function writeRecord(line) {
    return new Promise((resolve) => {
        if (!stream.write(line)) {
            stream.once('drain', resolve)
        } else {
            resolve()
        }
    })
}

console.log(
    `Gerando logs de acesso falsos em ${LOG_FILE}... (Ctrl + C para interromper)`,
)

console.log(`Limite de registros: ${maxRecords.toLocaleString()}`)

const users = Array.from({ length: 5 }, generateUser())
let count = 0

while (count < maxRecords) {
    const user = faker.helpers.arrayElement(users)
    const record = generateLogEntry(user)

    await writeRecord(JSON.stringify(record) + '\n')

    count++
}
