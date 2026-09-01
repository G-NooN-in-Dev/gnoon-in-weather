import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { FAVORITE_LOCATIONS_API_BASE_URL } from '@/lib/favorite-location/constants'
import { type AddFavoriteLocationInput, addFavoriteLocationSchema } from '@/lib/favorite-location/schemas'
import type {
	FavoriteLocation,
	FavoriteLocationCreateResponse,
	FavoriteLocationDeleteResponse,
	FavoriteLocationErrorResponse,
	FavoriteLocationsListResponse
} from '@/types/favorite-location.type'

type FavoriteLocationMutationResult = { ok: true; item: FavoriteLocation } | { ok: false; message: string }

type FavoriteLocationRemoveResult = { ok: true } | { ok: false; message: string }

async function parseFavoriteLocationError(response: Response): Promise<string> {
	const payload = (await response.json()) as FavoriteLocationErrorResponse

	return payload.error?.message ?? '요청을 처리하지 못했습니다.'
}

/** 클라이언트에서 관심지역 목록을 조회합니다. */
async function requestFavoriteLocations(): Promise<FavoriteLocation[]> {
	const response = await fetch(FAVORITE_LOCATIONS_API_BASE_URL)

	if (!response.ok) {
		return []
	}

	const payload = (await response.json()) as FavoriteLocationsListResponse

	return payload.items ?? []
}

/** 클라이언트에서 관심지역을 추가합니다. */
async function requestAddFavoriteLocation(input: AddFavoriteLocationInput): Promise<FavoriteLocationMutationResult> {
	const parsed = addFavoriteLocationSchema.safeParse(input)

	if (!parsed.success) {
		const fieldErrors = fieldErrorsFromZod(parsed.error)

		return {
			ok: false,
			message: Object.values(fieldErrors)[0] ?? '입력값을 확인해 주세요.'
		}
	}

	const response = await fetch(FAVORITE_LOCATIONS_API_BASE_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(parsed.data)
	})

	if (!response.ok) {
		return { ok: false, message: await parseFavoriteLocationError(response) }
	}

	const payload = (await response.json()) as FavoriteLocationCreateResponse

	return { ok: true, item: payload.item }
}

/** 클라이언트에서 관심지역을 삭제합니다. */
async function requestRemoveFavoriteLocation(favoriteId: string): Promise<FavoriteLocationRemoveResult> {
	const response = await fetch(`${FAVORITE_LOCATIONS_API_BASE_URL}?id=${encodeURIComponent(favoriteId)}`, {
		method: 'DELETE'
	})

	if (!response.ok) {
		return { ok: false, message: await parseFavoriteLocationError(response) }
	}

	await (response.json() as Promise<FavoriteLocationDeleteResponse>)

	return { ok: true }
}

export { requestAddFavoriteLocation, requestFavoriteLocations, requestRemoveFavoriteLocation }
export type { FavoriteLocationMutationResult, FavoriteLocationRemoveResult }
