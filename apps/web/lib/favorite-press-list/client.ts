import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { FAVORITE_PRESS_LISTS_API_BASE_URL } from '@/lib/favorite-press-list/constants'
import {
	type CreateFavoritePressListInput,
	createFavoritePressListSchema,
	type UpdateFavoritePressListInput,
	updateFavoritePressListSchema
} from '@/lib/favorite-press-list/schemas'
import type {
	FavoritePressList,
	FavoritePressListCreateResponse,
	FavoritePressListDeleteResponse,
	FavoritePressListErrorResponse,
	FavoritePressListsListResponse,
	FavoritePressListUpdateResponse
} from '@/types/favorite-press-list.type'

type FavoritePressListMutationResult = { ok: true; item: FavoritePressList } | { ok: false; message: string }

type FavoritePressListRemoveResult = { ok: true } | { ok: false; message: string }

async function parseFavoritePressListError(response: Response): Promise<string> {
	const payload = (await response.json()) as FavoritePressListErrorResponse

	return payload.error?.message ?? '요청을 처리하지 못했습니다.'
}

/** 클라이언트에서 언론사 선호목록을 조회합니다. */
async function requestFavoritePressLists(): Promise<FavoritePressList[]> {
	const response = await fetch(FAVORITE_PRESS_LISTS_API_BASE_URL)

	if (!response.ok) {
		return []
	}

	const payload = (await response.json()) as FavoritePressListsListResponse

	return payload.items ?? []
}

/** 클라이언트에서 언론사 선호목록을 추가합니다. */
async function requestCreateFavoritePressList(
	input: CreateFavoritePressListInput
): Promise<FavoritePressListMutationResult> {
	const parsed = createFavoritePressListSchema.safeParse(input)

	if (!parsed.success) {
		const fieldErrors = fieldErrorsFromZod(parsed.error)

		return {
			ok: false,
			message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.'
		}
	}

	const response = await fetch(FAVORITE_PRESS_LISTS_API_BASE_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(parsed.data)
	})

	if (!response.ok) {
		return { ok: false, message: await parseFavoritePressListError(response) }
	}

	const payload = (await response.json()) as FavoritePressListCreateResponse

	return { ok: true, item: payload.item }
}

/** 클라이언트에서 언론사 선호목록의 언론사 구성을 수정합니다. */
async function requestUpdateFavoritePressList(
	input: UpdateFavoritePressListInput
): Promise<FavoritePressListMutationResult> {
	const parsed = updateFavoritePressListSchema.safeParse(input)

	if (!parsed.success) {
		const fieldErrors = fieldErrorsFromZod(parsed.error)

		return {
			ok: false,
			message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.'
		}
	}

	const response = await fetch(FAVORITE_PRESS_LISTS_API_BASE_URL, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(parsed.data)
	})

	if (!response.ok) {
		return { ok: false, message: await parseFavoritePressListError(response) }
	}

	const payload = (await response.json()) as FavoritePressListUpdateResponse

	return { ok: true, item: payload.item }
}

/** 클라이언트에서 언론사 선호목록을 삭제합니다. */
async function requestRemoveFavoritePressList(favoriteId: string): Promise<FavoritePressListRemoveResult> {
	const response = await fetch(`${FAVORITE_PRESS_LISTS_API_BASE_URL}?id=${encodeURIComponent(favoriteId)}`, {
		method: 'DELETE'
	})

	if (!response.ok) {
		return { ok: false, message: await parseFavoritePressListError(response) }
	}

	await (response.json() as Promise<FavoritePressListDeleteResponse>)

	return { ok: true }
}

export {
	requestCreateFavoritePressList,
	requestFavoritePressLists,
	requestRemoveFavoritePressList,
	requestUpdateFavoritePressList
}
export type { FavoritePressListMutationResult, FavoritePressListRemoveResult }
