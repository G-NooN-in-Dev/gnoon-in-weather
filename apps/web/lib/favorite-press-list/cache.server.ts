import { revalidateTag } from 'next/cache'

/** MY SSR 선호목록 Cache Components 갱신 주기 — 1분 */
const FAVORITE_PRESS_LISTS_REVALIDATE_SECONDS = 60

function favoritePressListsCacheTag(userId: string) {
	return `favorite-press-lists-${userId}`
}

/** 선호목록 변경 후 SSR 캐시를 즉시 무효화합니다. (Route Handler — updateTag 불가) */
function invalidateFavoritePressListsCache(userId: string) {
	revalidateTag(favoritePressListsCacheTag(userId), { expire: 0 })
}

export { FAVORITE_PRESS_LISTS_REVALIDATE_SECONDS, favoritePressListsCacheTag, invalidateFavoritePressListsCache }
