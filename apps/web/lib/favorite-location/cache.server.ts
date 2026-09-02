import { revalidateTag } from 'next/cache'

/** MY·홈 SSR favorites Cache Components 갱신 주기 — 1분 */
const FAVORITE_LOCATIONS_REVALIDATE_SECONDS = 60

function favoriteLocationsCacheTag(userId: string) {
	return `favorite-locations-${userId}`
}

/** 관심지역 변경 후 SSR 캐시를 즉시 무효화합니다. (Route Handler — updateTag 불가) */
function invalidateFavoriteLocationsCache(userId: string) {
	revalidateTag(favoriteLocationsCacheTag(userId), { expire: 0 })
}

export { FAVORITE_LOCATIONS_REVALIDATE_SECONDS, favoriteLocationsCacheTag, invalidateFavoriteLocationsCache }
