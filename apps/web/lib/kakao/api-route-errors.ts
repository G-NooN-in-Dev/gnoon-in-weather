import type { AppApiError } from '@/types/error.type'

/** `/api/kakao/search` 검색어 누락·너무 짧을 때 */
const KAKAO_INVALID_QUERY_ERROR: AppApiError = {
	provider: 'kakao',
	code: 0,
	key: 'KAKAO_INVALID_QUERY',
	status: 400,
	retryable: false,
	message: '검색어를 두 글자 이상 입력해 주세요.'
}

/** `/api/kakao/coord2address` 좌표 누락·형식 오류 */
const KAKAO_INVALID_COORDINATES_ERROR: AppApiError = {
	provider: 'kakao',
	code: 0,
	key: 'KAKAO_INVALID_COORDINATES',
	status: 400,
	retryable: false,
	message: '좌표가 유효하지 않습니다.'
}

export { KAKAO_INVALID_COORDINATES_ERROR, KAKAO_INVALID_QUERY_ERROR }
