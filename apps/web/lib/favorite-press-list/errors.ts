import type { FavoritePressListApiError, FavoritePressListApiErrorStatus } from '@/types/favorite-press-list.type'

type CreateFavoritePressListErrorInput = {
	key: string
	message: string
	status: FavoritePressListApiErrorStatus
}

/** 언론사 선호목록 API에서 throw·응답에 쓰는 에러 객체를 만듭니다. */
function createFavoritePressListError({
	key,
	message,
	status
}: CreateFavoritePressListErrorInput): FavoritePressListApiError {
	return { key, message, status }
}

function isFavoritePressListApiError(error: unknown): error is FavoritePressListApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'key' in error &&
		'message' in error &&
		'status' in error &&
		typeof (error as FavoritePressListApiError).key === 'string' &&
		typeof (error as FavoritePressListApiError).message === 'string' &&
		typeof (error as FavoritePressListApiError).status === 'number'
	)
}

export { createFavoritePressListError, isFavoritePressListApiError }
