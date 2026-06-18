import type { AppApiError } from '@/types/error.type'

/** `/api/weather` 좌표 누락·형식 오류 시 반환할 공통 에러입니다. */
const WEATHER_INVALID_COORDINATES_ERROR: AppApiError = {
	provider: 'weatherapi',
	code: 0,
	key: 'WEATHER_INVALID_COORDINATES',
	status: 400,
	retryable: false,
	message: '좌표가 유효하지 않습니다.'
}

export { WEATHER_INVALID_COORDINATES_ERROR }
