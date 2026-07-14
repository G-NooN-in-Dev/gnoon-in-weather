import type { AppApiErrorRule } from '@/types/error.type'

/**
 * WeatherAPI 공식 에러 코드 목록을 매핑합니다.
 * 참고: https://www.weatherapi.com/docs/#intro-error-codes
 */
const WEATHER_ERROR_RULES: Record<number, AppApiErrorRule> = {
	1002: {
		key: 'WEATHER_MISSING_API_KEY',
		status: 401,
		retryable: false,
		message: '날씨 API 키가 누락되었습니다.'
	},
	1003: {
		key: 'WEATHER_INVALID_LOCATION_QUERY',
		status: 400,
		retryable: false,
		message: '날씨 요청 위치 정보가 누락되었습니다.'
	},
	1005: {
		key: 'WEATHER_INVALID_REQUEST_URL',
		status: 400,
		retryable: false,
		message: '날씨 요청 URL이 올바르지 않습니다.'
	},
	1006: {
		key: 'WEATHER_LOCATION_NOT_FOUND',
		status: 404,
		retryable: false,
		message: '해당 위치의 날씨 정보를 찾을 수 없습니다.'
	},
	2006: {
		key: 'WEATHER_INVALID_API_KEY',
		status: 401,
		retryable: false,
		message: '날씨 API 키가 유효하지 않습니다.'
	},
	2007: {
		key: 'WEATHER_MONTHLY_QUOTA_EXCEEDED',
		status: 403,
		retryable: false,
		message: '월간 호출 한도를 초과했습니다. 요금제 또는 사용량을 확인해주세요.'
	},
	2008: {
		key: 'WEATHER_DISABLED_API_KEY',
		status: 403,
		retryable: false,
		message: '날씨 API 키가 비활성화되었습니다.'
	},
	2009: {
		key: 'WEATHER_NO_ACCESS_RIGHTS',
		status: 403,
		retryable: false,
		message: '현재 요금제로 이동할 수 없는 기능입니다. 요금제별 허용 기능을 확인해주세요.'
	},
	9999: {
		key: 'WEATHER_INTERNAL_ERROR',
		status: 502,
		retryable: true,
		message: '날씨 서비스 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
	}
}

export { WEATHER_ERROR_RULES }
