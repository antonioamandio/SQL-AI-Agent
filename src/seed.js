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
