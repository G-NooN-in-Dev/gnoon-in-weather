/** API·클라이언트에 노출하는 언론사 선호목록 항목 */
type FavoritePressList = {
	id: string
	name: string
	domains: string[]
}

type FavoritePressListApiErrorStatus = 400 | 401 | 404 | 409 | 500

type FavoritePressListApiError = {
	key: string
	message: string
	status: FavoritePressListApiErrorStatus
}

type FavoritePressListsListResponse = {
	items: FavoritePressList[]
}

type FavoritePressListCreateResponse = {
	item: FavoritePressList
}

type FavoritePressListUpdateResponse = {
	item: FavoritePressList
}

type FavoritePressListDeleteResponse = {
	ok: true
}

type FavoritePressListErrorResponse = {
	error: FavoritePressListApiError
}

export type {
	FavoritePressList,
	FavoritePressListApiError,
	FavoritePressListApiErrorStatus,
	FavoritePressListCreateResponse,
	FavoritePressListDeleteResponse,
	FavoritePressListErrorResponse,
	FavoritePressListsListResponse,
	FavoritePressListUpdateResponse
}
