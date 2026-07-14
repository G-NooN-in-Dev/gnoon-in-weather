import { DEFAULT_COORDINATES } from '@/lib/location/constants'
import { readLatestSearchedLocationFromCookies } from '@/lib/location/cookie.server'
import type { LocationState } from '@/types/location.type'

/** 메인 페이지 서버 렌더용 초기 좌표를 결정합니다. (쿠키 → 기본 좌표) */
async function resolveHomeLocation(): Promise<LocationState> {
	const stored = await readLatestSearchedLocationFromCookies()

	return stored ?? { ...DEFAULT_COORDINATES, label: '서울시청' }
}

export { resolveHomeLocation }
