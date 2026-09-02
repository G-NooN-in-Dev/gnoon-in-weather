import { cacheLife, cacheTag } from 'next/cache'

import {
	FAVORITE_PRESS_LISTS_REVALIDATE_SECONDS,
	favoritePressListsCacheTag
} from '@/lib/favorite-press-list/cache.server'
import { loadFavoritePressLists } from '@/services/favorite-press-list.loader'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

/** SSR용 언론사 선호목록 — userId별 Cache Components 캐시 */
async function loadFavoritePressListsCached(userId: string): Promise<FavoritePressList[]> {
	'use cache'
	cacheTag(favoritePressListsCacheTag(userId))
	cacheLife({ revalidate: FAVORITE_PRESS_LISTS_REVALIDATE_SECONDS })

	return loadFavoritePressLists(userId)
}

export { loadFavoritePressListsCached }
