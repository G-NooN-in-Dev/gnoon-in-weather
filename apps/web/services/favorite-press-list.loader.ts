import { listFavoritePressLists } from '@/services/favorite-press-list.service'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

/** SSR·초기 데이터용 언론사 선호목록을 조회합니다. */
async function loadFavoritePressLists(userId: string): Promise<FavoritePressList[]> {
	return listFavoritePressLists(userId)
}

export { loadFavoritePressLists }
