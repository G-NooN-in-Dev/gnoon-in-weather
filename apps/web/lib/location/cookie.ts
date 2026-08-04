import {
	LATEST_SEARCHED_LOCATION_COOKIE_MAX_AGE_SECONDS,
	LATEST_SEARCHED_LOCATION_COOKIE_NAME
} from '@/lib/location/constants'
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
		const parsed: unknown = JSON.parse(value)

		if (!parsed || typeof parsed !== 'object') {
			return null
		}

		const { lat, lng, label } = parsed as Record<string, unknown>

		if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) {
			return null
		}

		// label이 있으면 문자열이어야 하고, 없으면 빈 문자열로 맞춥니다.
		if (label !== undefined && typeof label !== 'string') {
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

	const payload = JSON.stringify(location satisfies RecentLocationCookie)

	document.cookie = `${LATEST_SEARCHED_LOCATION_COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=${LATEST_SEARCHED_LOCATION_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

export { parseLatestSearchedLocationCookie, readLatestSearchedLocationCookie, writeLatestSearchedLocationCookie }
