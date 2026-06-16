import type { Coordinates } from '@/types/location.type'

/** 최근 위치 쿠키 이름 */
const RECENT_LOCATION_COOKIE_NAME = 'latest-searched-location'

/** 최근 위치 쿠키 유지 기간(30일) */
const RECENT_LOCATION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

/** 위치 정보가 없을 때 사용하는 기본 좌표(서울 시청) */
const DEFAULT_COORDINATES: Coordinates = {
	lat: 37.5685,
	lng: 126.978
}

export { DEFAULT_COORDINATES, RECENT_LOCATION_COOKIE_MAX_AGE_SECONDS, RECENT_LOCATION_COOKIE_NAME }
