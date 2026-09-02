import { cacheLife, cacheTag } from 'next/cache'

import { FAVORITE_LOCATIONS_REVALIDATE_SECONDS, favoriteLocationsCacheTag } from '@/lib/favorite-location/cache.server'
import { loadFavoriteLocations } from '@/services/favorite-location.loader'
import type { FavoriteLocation } from '@/types/favorite-location.type'

/** SSR용 관심지역 목록 — userId별 Cache Components 캐시 */
async function loadFavoriteLocationsCached(userId: string): Promise<FavoriteLocation[]> {
	'use cache'
	cacheTag(favoriteLocationsCacheTag(userId))
	cacheLife({ revalidate: FAVORITE_LOCATIONS_REVALIDATE_SECONDS })

	return loadFavoriteLocations(userId)
}

export { loadFavoriteLocationsCached }
