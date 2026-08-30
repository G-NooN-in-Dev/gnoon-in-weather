import { type Db, MongoClient } from 'mongodb'

import { MAIN_DB } from '@/lib/mongodb/constants'

/**
 * Next.js Hot Reload에서 연결이 중복 생성되지 않도록
 * 개발 환경에서는 globalThis에 Promise를 캐시합니다.
 */
declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string {
	const uri = process.env.MONGODB_URI

	if (!uri) {
		throw new Error('MONGODB_URI 환경 변수가 설정되지 않았습니다.')
	}

	return uri
}

function createClientPromise(): Promise<MongoClient> {
	const uri = getMongoUri()
	const client = new MongoClient(uri)

	return client.connect()
}

function getClientPromise(): Promise<MongoClient> {
	if (process.env.NODE_ENV === 'development') {
		if (!globalThis._mongoClientPromise) {
			globalThis._mongoClientPromise = createClientPromise()
		}

		return globalThis._mongoClientPromise
	}

	return createClientPromise()
}

/** 연결된 MongoClient를 반환합니다. */
async function getMongoClient(): Promise<MongoClient> {
	return getClientPromise()
}

/**
 * 메인 DB(`platform`) 핸들을 반환합니다.
 */
async function getDb(): Promise<Db> {
	const client = await getMongoClient()

	return client.db(MAIN_DB)
}

export { getDb, getMongoClient }
