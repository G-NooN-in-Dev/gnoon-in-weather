import { FAVORITE_LOCATION_COORD_EPSILON } from '@/lib/favorite-location/constants'
import type { FavoriteLocation } from '@/types/favorite-location.type'

type FavoriteLocationMatchInput = {
	placeId?: string | null
	lat: number
	lng: number
}

/** 관심지역과 현재 위치가 같은 장소인지 판별합니다. */
function isSameFavoriteLocation(
	favorite: Pick<FavoriteLocation, 'placeId' | 'lat' | 'lng'>,
	current: FavoriteLocationMatchInput
): boolean {
	if (favorite.placeId && current.placeId && favorite.placeId === current.placeId) {
		return true
	}

	return (
		Math.abs(favorite.lat - current.lat) < FAVORITE_LOCATION_COORD_EPSILON &&
		Math.abs(favorite.lng - current.lng) < FAVORITE_LOCATION_COORD_EPSILON
	)
}

export { isSameFavoriteLocation }
export type { FavoriteLocationMatchInput }
