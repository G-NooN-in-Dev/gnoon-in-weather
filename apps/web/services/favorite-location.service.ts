import { type Collection, ObjectId, type WithId } from 'mongodb'

import { FAVORITE_LOCATION_MAX_ITEMS, FAVORITE_LOCATION_TOAST } from '@/lib/favorite-location/constants'
import { createFavoriteLocationError } from '@/lib/favorite-location/errors'
import { isSameFavoriteLocation } from '@/lib/favorite-location/match'
import type { AddFavoriteLocationInput } from '@/lib/favorite-location/schemas'
import { getDb } from '@/lib/mongodb/client'
import { FAVORITE_LOCATIONS_COLLECTION } from '@/lib/mongodb/constants'
import type { FavoriteLocation } from '@/types/favorite-location.type'

/** MongoDB `platform.favorite_locations` 컬렉션 문서 (_id는 드라이버 WithId로 부여) */
type FavoriteLocationDocument = {
	userId: ObjectId
	placeId: string | null
	label: string
	address: string
	lat: number
	lng: number
	createdAt: Date
}

function toFavoriteLocation(doc: WithId<FavoriteLocationDocument>): FavoriteLocation {
	const { _id, placeId, label, address, lat, lng } = doc

	return { id: _id.toHexString(), placeId, label, address, lat, lng }
}

let favoriteLocationsIndexReady: Promise<void> | null = null

/** userId·placeId·createdAt 인덱스를 한 번만 보장합니다. */
async function ensureFavoriteLocationsIndexes(collection: Collection<FavoriteLocationDocument>): Promise<void> {
	if (!favoriteLocationsIndexReady) {
		favoriteLocationsIndexReady = Promise.all([
			collection.createIndex({ userId: 1, createdAt: 1 }),
			collection.createIndex(
				{ userId: 1, placeId: 1 },
				{ unique: true, partialFilterExpression: { placeId: { $type: 'string' } } }
			)
		]).then(() => undefined)
	}

	await favoriteLocationsIndexReady
}

async function getFavoriteLocationsCollection(): Promise<Collection<FavoriteLocationDocument>> {
	const db = await getDb()
	const collection = db.collection<FavoriteLocationDocument>(FAVORITE_LOCATIONS_COLLECTION)

	await ensureFavoriteLocationsIndexes(collection)

	return collection
}

/** 유저의 관심지역 목록을 오래된순으로 조회합니다. */
async function listFavoriteLocations(userId: string): Promise<FavoriteLocation[]> {
	if (!ObjectId.isValid(userId)) {
		return []
	}

	const collection = await getFavoriteLocationsCollection()
	const docs = await collection
		.find({ userId: new ObjectId(userId) })
		.sort({ createdAt: 1 })
		.limit(FAVORITE_LOCATION_MAX_ITEMS)
		.toArray()

	return docs.map(toFavoriteLocation)
}

/** 관심지역을 추가합니다. 최대 개수·중복을 검사합니다. */
async function addFavoriteLocation(userId: string, input: AddFavoriteLocationInput): Promise<FavoriteLocation> {
	if (!ObjectId.isValid(userId)) {
		throw createFavoriteLocationError({
			key: 'FAVORITE_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const collection = await getFavoriteLocationsCollection()
	const userObjectId = new ObjectId(userId)
	const existingItems = await collection
		.find({ userId: userObjectId })
		.sort({ createdAt: -1 })
		.limit(FAVORITE_LOCATION_MAX_ITEMS)
		.toArray()

	if (existingItems.length >= FAVORITE_LOCATION_MAX_ITEMS) {
		throw createFavoriteLocationError({
			key: 'FAVORITE_LIMIT_REACHED',
			message: FAVORITE_LOCATION_TOAST.LIMIT_REACHED,
			status: 409
		})
	}

	const isDuplicate = existingItems.some((item) =>
		isSameFavoriteLocation(item, {
			placeId: input.placeId,
			lat: input.lat,
			lng: input.lng
		})
	)

	if (isDuplicate) {
		throw createFavoriteLocationError({
			key: 'FAVORITE_ALREADY_EXISTS',
			message: '이미 관심지역으로 등록된 장소입니다.',
			status: 409
		})
	}

	const now = new Date()
	const doc = {
		userId: userObjectId,
		placeId: input.placeId,
		label: input.label,
		address: input.address,
		lat: input.lat,
		lng: input.lng,
		createdAt: now
	} satisfies FavoriteLocationDocument

	const result = await collection.insertOne(doc)

	return toFavoriteLocation({ _id: result.insertedId, ...doc })
}

/** 본인 관심지역을 id로 삭제합니다. */
async function removeFavoriteLocation(userId: string, favoriteId: string): Promise<void> {
	if (!ObjectId.isValid(userId) || !ObjectId.isValid(favoriteId)) {
		throw createFavoriteLocationError({
			key: 'FAVORITE_NOT_FOUND',
			message: '관심지역을 찾을 수 없습니다.',
			status: 404
		})
	}

	const collection = await getFavoriteLocationsCollection()
	const result = await collection.deleteOne({
		_id: new ObjectId(favoriteId),
		userId: new ObjectId(userId)
	})

	if (result.deletedCount === 0) {
		throw createFavoriteLocationError({
			key: 'FAVORITE_NOT_FOUND',
			message: '관심지역을 찾을 수 없습니다.',
			status: 404
		})
	}
}

/** 유저의 관심지역을 전부 삭제합니다. */
async function removeAllFavoriteLocationsByUserId(userId: string): Promise<void> {
	if (!ObjectId.isValid(userId)) {
		return
	}

	const collection = await getFavoriteLocationsCollection()

	await collection.deleteMany({ userId: new ObjectId(userId) })
}

export { addFavoriteLocation, listFavoriteLocations, removeAllFavoriteLocationsByUserId, removeFavoriteLocation }
