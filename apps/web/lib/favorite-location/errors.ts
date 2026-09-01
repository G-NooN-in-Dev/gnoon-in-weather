import type { FavoriteLocationApiError, FavoriteLocationApiErrorStatus } from '@/types/favorite-location.type'

type CreateFavoriteLocationErrorInput = {
	key: string
	message: string
	status: FavoriteLocationApiErrorStatus
}

/** 관심지역 API에서 throw·응답에 쓰는 에러 객체를 만듭니다. */
function createFavoriteLocationError({
	key,
	message,
	status
}: CreateFavoriteLocationErrorInput): FavoriteLocationApiError {
	return { key, message, status }
}

function isFavoriteLocationApiError(error: unknown): error is FavoriteLocationApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'key' in error &&
		'message' in error &&
		'status' in error &&
		typeof (error as FavoriteLocationApiError).key === 'string' &&
		typeof (error as FavoriteLocationApiError).message === 'string' &&
		typeof (error as FavoriteLocationApiError).status === 'number'
	)
}

export { createFavoriteLocationError, isFavoriteLocationApiError }
