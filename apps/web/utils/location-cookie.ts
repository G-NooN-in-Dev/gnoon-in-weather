import { LATEST_SEARCHED_LOCATION_COOKIE_MAX_AGE_SECONDS, LATEST_SEARCHED_LOCATION_COOKIE_NAME } from '@/libs/location'
import type { LocationState } from '@/types/location.type'
import { readBrowserCookie } from '@/utils/cookie'

type RecentLocationCookie = {
	lat: number
	lng: number
	label?: string
}

/** 쿠키 JSON을 LocationState로 안전하게 변환합니다. */
function parseLatestSearchedLocationCookie(value: string): LocationState | null {
	try {
		const parsed = JSON.parse(value) as RecentLocationCookie
		const { lat, lng, label } = parsed

		if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
			return null
		}

		return { lat, lng, label: label ?? '' }
	} catch {
		return null
	}
}

/** 브라우저에 저장된 최근 위치를 읽습니다. */
function readLatestSearchedLocationCookie(): LocationState | null {
	if (typeof document === 'undefined') {
		return null
	}

	const encoded = readBrowserCookie(LATEST_SEARCHED_LOCATION_COOKIE_NAME)
	return encoded ? parseLatestSearchedLocationCookie(decodeURIComponent(encoded)) : null
}

/** 메인 페이지에서 최근 조회한 좌표를 쿠키에 저장합니다. */
function writeLatestSearchedLocationCookie(location: LocationState): void {
	if (typeof document === 'undefined') {
		return
	}

	const { lat, lng, label } = location
	const payload = JSON.stringify({ lat, lng, label } satisfies RecentLocationCookie)

	document.cookie = `${LATEST_SEARCHED_LOCATION_COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=${LATEST_SEARCHED_LOCATION_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

export { parseLatestSearchedLocationCookie, readLatestSearchedLocationCookie, writeLatestSearchedLocationCookie }
