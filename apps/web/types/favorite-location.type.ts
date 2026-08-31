/** API·클라이언트에 노출하는 관심지역 항목 */
type FavoriteLocation = {
	id: string
	placeId: string | null
	label: string
	address: string
	lat: number
	lng: number
}

type FavoriteLocationApiErrorStatus = 400 | 401 | 404 | 409 | 500

type FavoriteLocationApiError = {
	key: string
	message: string
	status: FavoriteLocationApiErrorStatus
}

type FavoriteLocationsListResponse = {
	items: FavoriteLocation[]
}

type FavoriteLocationCreateResponse = {
	item: FavoriteLocation
}

type FavoriteLocationDeleteResponse = {
	ok: true
}

type FavoriteLocationErrorResponse = {
	error: FavoriteLocationApiError
}

export type {
	FavoriteLocation,
	FavoriteLocationApiError,
	FavoriteLocationApiErrorStatus,
	FavoriteLocationCreateResponse,
	FavoriteLocationDeleteResponse,
	FavoriteLocationErrorResponse,
	FavoriteLocationsListResponse
}
