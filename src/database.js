import { DatabaseSync } from 'node:sqlite'

export function createDatabase(path = ':memory:') {
    const database = new DatabaseSync(path)

    database.exec(`
		CREATE TABLE IF NOT EXISTS access_logs (
			ip			TEXT NOT NULL,
			username	TEXT NOT NULL,
			firstName	TEXT NOT NULL,
			lastName	TEXT NOT NULL,
			email		TEXT NOT NULL,
			location	TEXT NOT NULL,
			jobArea		TEXT NOT NULL,
			company		TEXT NOT NULL,
			jobTitle	TEXT NOT NULL,
			id			TEXT PRIMARY KEY,
			timestamp	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`)

    return database
}

const db = createDatabase('access_logs.db')
