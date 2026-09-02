import { type Collection, MongoServerError, ObjectId, type WithId } from 'mongodb'

import { FAVORITE_PRESS_LIST_MAX_ITEMS, FAVORITE_PRESS_LIST_TOAST } from '@/lib/favorite-press-list/constants'
import { arePressDomainsEqual, normalizePressDomains } from '@/lib/favorite-press-list/domains'
import { createFavoritePressListError } from '@/lib/favorite-press-list/errors'
import type { CreateFavoritePressListInput, UpdateFavoritePressListInput } from '@/lib/favorite-press-list/schemas'
import { getDb } from '@/lib/mongodb/client'
import { FAVORITE_PRESS_LISTS_COLLECTION } from '@/lib/mongodb/constants'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

/** MongoDB `platform.favorite_press_lists` 컬렉션 문서 */
type FavoritePressListDocument = {
	userId: ObjectId
	name: string
	domains: string[]
	createdAt: Date
	updatedAt: Date
}

function toFavoritePressList(doc: WithId<FavoritePressListDocument>): FavoritePressList {
	const { _id, name, domains } = doc

	return { id: _id.toHexString(), name, domains }
}

let favoritePressListsIndexReady: Promise<void> | null = null

/** userId·name·createdAt 인덱스를 한 번만 보장합니다. */
async function ensureFavoritePressListsIndexes(collection: Collection<FavoritePressListDocument>): Promise<void> {
	if (!favoritePressListsIndexReady) {
		favoritePressListsIndexReady = Promise.all([
			collection.createIndex({ userId: 1, createdAt: 1 }),
			collection.createIndex({ userId: 1, name: 1 }, { unique: true })
		]).then(() => undefined)
	}

	await favoritePressListsIndexReady
}

async function getFavoritePressListsCollection(): Promise<Collection<FavoritePressListDocument>> {
	const db = await getDb()
	const collection = db.collection<FavoritePressListDocument>(FAVORITE_PRESS_LISTS_COLLECTION)

	await ensureFavoritePressListsIndexes(collection)

	return collection
}

/** 유저의 언론사 선호목록을 오래된순으로 조회합니다. */
async function listFavoritePressLists(userId: string): Promise<FavoritePressList[]> {
	if (!ObjectId.isValid(userId)) {
		return []
	}

	const collection = await getFavoritePressListsCollection()
	const docs = await collection
		.find({ userId: new ObjectId(userId) })
		.sort({ createdAt: 1 })
		.limit(FAVORITE_PRESS_LIST_MAX_ITEMS)
		.toArray()

	return docs.map(toFavoritePressList)
}

/** 언론사 선호목록을 추가합니다. 최대 개수·이름·언론사 조합 중복을 검사합니다. */
async function addFavoritePressList(userId: string, input: CreateFavoritePressListInput): Promise<FavoritePressList> {
	if (!ObjectId.isValid(userId)) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_UNAUTHORIZED',
			message: '로그인이 필요합니다.',
			status: 401
		})
	}

	const collection = await getFavoritePressListsCollection()
	const userObjectId = new ObjectId(userId)
	const existingItems = await collection.find({ userId: userObjectId }).limit(FAVORITE_PRESS_LIST_MAX_ITEMS).toArray()

	if (existingItems.length >= FAVORITE_PRESS_LIST_MAX_ITEMS) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_LIMIT_REACHED',
			message: FAVORITE_PRESS_LIST_TOAST.LIMIT_REACHED,
			status: 409
		})
	}

	const normalizedDomains = normalizePressDomains(input.domains)

	if (existingItems.some((item) => arePressDomainsEqual(item.domains, normalizedDomains))) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_DOMAINS_EXISTS',
			message: FAVORITE_PRESS_LIST_TOAST.DUPLICATE_COMBINATION,
			status: 409
		})
	}

	const now = new Date()
	const doc = {
		userId: userObjectId,
		name: input.name,
		domains: normalizedDomains,
		createdAt: now,
		updatedAt: now
	} satisfies FavoritePressListDocument

	try {
		const result = await collection.insertOne(doc)

		return toFavoritePressList({ _id: result.insertedId, ...doc })
	} catch (caught) {
		if (caught instanceof MongoServerError && caught.code === 11000) {
			throw createFavoritePressListError({
				key: 'FAVORITE_PRESS_NAME_EXISTS',
				message: '이미 같은 이름의 선호목록이 있습니다.',
				status: 409
			})
		}

		throw caught
	}
}

/** 본인 선호목록의 언론사 구성을 수정합니다. */
async function updateFavoritePressList(
	userId: string,
	input: UpdateFavoritePressListInput
): Promise<FavoritePressList> {
	if (!ObjectId.isValid(userId) || !ObjectId.isValid(input.id)) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_NOT_FOUND',
			message: '선호목록을 찾을 수 없습니다.',
			status: 404
		})
	}

	const collection = await getFavoritePressListsCollection()
	const userObjectId = new ObjectId(userId)
	const normalizedDomains = normalizePressDomains(input.domains)
	const siblingItems = await collection
		.find({ userId: userObjectId, _id: { $ne: new ObjectId(input.id) } })
		.limit(FAVORITE_PRESS_LIST_MAX_ITEMS)
		.toArray()

	if (siblingItems.some((item) => arePressDomainsEqual(item.domains, normalizedDomains))) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_DOMAINS_EXISTS',
			message: FAVORITE_PRESS_LIST_TOAST.DUPLICATE_COMBINATION,
			status: 409
		})
	}

	const result = await collection.findOneAndUpdate(
		{ _id: new ObjectId(input.id), userId: userObjectId },
		{
			$set: {
				domains: normalizedDomains,
				updatedAt: new Date()
			}
		},
		{ returnDocument: 'after' }
	)

	if (!result) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_NOT_FOUND',
			message: '선호목록을 찾을 수 없습니다.',
			status: 404
		})
	}

	return toFavoritePressList(result)
}

/** 본인 선호목록을 id로 삭제합니다. */
async function removeFavoritePressList(userId: string, favoriteId: string): Promise<void> {
	if (!ObjectId.isValid(userId) || !ObjectId.isValid(favoriteId)) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_NOT_FOUND',
			message: '선호목록을 찾을 수 없습니다.',
			status: 404
		})
	}

	const collection = await getFavoritePressListsCollection()
	const result = await collection.deleteOne({
		_id: new ObjectId(favoriteId),
		userId: new ObjectId(userId)
	})

	if (result.deletedCount === 0) {
		throw createFavoritePressListError({
			key: 'FAVORITE_PRESS_NOT_FOUND',
			message: '선호목록을 찾을 수 없습니다.',
			status: 404
		})
	}
}

/** 유저의 언론사 선호목록을 전부 삭제합니다. */
async function removeAllFavoritePressListsByUserId(userId: string): Promise<void> {
	if (!ObjectId.isValid(userId)) {
		return
	}

	const collection = await getFavoritePressListsCollection()

	await collection.deleteMany({ userId: new ObjectId(userId) })
}

export {
	addFavoritePressList,
	listFavoritePressLists,
	removeAllFavoritePressListsByUserId,
	removeFavoritePressList,
	updateFavoritePressList
}
