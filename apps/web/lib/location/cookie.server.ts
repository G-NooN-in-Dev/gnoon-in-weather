import { cookies } from 'next/headers'

import { LATEST_SEARCHED_LOCATION_COOKIE_NAME } from '@/lib/location/constants'
import { parseLatestSearchedLocationCookie } from '@/lib/location/cookie'
import type { LocationState } from '@/types/location.type'

/** 서버에서 저장된 최근 위치 쿠키를 읽습니다. */
async function readLatestSearchedLocationFromCookies(): Promise<LocationState | null> {
	const cookieStore = await cookies()
	const raw = cookieStore.get(LATEST_SEARCHED_LOCATION_COOKIE_NAME)?.value

	return raw ? parseLatestSearchedLocationCookie(decodeURIComponent(raw)) : null
}

export { readLatestSearchedLocationFromCookies }
