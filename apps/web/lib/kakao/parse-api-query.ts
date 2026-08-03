import { KAKAO_SEARCH_MIN_QUERY_LENGTH } from '@/lib/kakao/constants'
import { parseCoordinates } from '@/lib/weather/parse-api-query'
import type { Coordinates } from '@/types/location.type'

/** `/api/kakao/search`의 q 파라미터. 최소 길이 미만이면 null. */
function parseKakaoSearchQuery(searchParams: URLSearchParams): string | null {
	const query = searchParams.get('q')?.trim() ?? ''

	if (query.length < KAKAO_SEARCH_MIN_QUERY_LENGTH) {
		return null
	}

	return query
}

/** `/api/kakao/coord2address`의 lat/lng. 유효하지 않으면 null. */
function parseKakaoCoordQuery(searchParams: URLSearchParams): Coordinates | null {
	return parseCoordinates(searchParams)
}

export { parseKakaoCoordQuery, parseKakaoSearchQuery }
