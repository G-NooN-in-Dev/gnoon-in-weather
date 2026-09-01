import { listFavoriteLocations } from '@/services/favorite-location.service'
import type { FavoriteLocation } from '@/types/favorite-location.type'

/** SSR·초기 데이터용 관심지역 목록을 조회합니다. */
async function loadFavoriteLocations(userId: string): Promise<FavoriteLocation[]> {
	return listFavoriteLocations(userId)
}

export { loadFavoriteLocations }
