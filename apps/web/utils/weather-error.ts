import { WEATHER_ERROR_RULES } from '@/libs/weather-error-rules'
import type { AppApiError } from '@/types/error.type'

type WeatherApiErrorPayload = {
	error?: {
		code?: number
		message?: string
	}
}

/** WeatherAPI 응답 에러를 앱 공통 에러 포맷으로 정규화합니다. */
function normalizeWeatherApiError(payload: WeatherApiErrorPayload): AppApiError {
	const code = payload.error?.code ?? 0
	const rule = WEATHER_ERROR_RULES[code]

	if (rule) {
		const { key, status, retryable, message } = rule
		return { provider: 'weatherapi', code, key, message, retryable, status }
	}

	// 문서에 없는 신규 코드가 들어와도 사용자 경험이 깨지지 않도록 안전 기본값을 반환합니다.
	return {
		provider: 'weatherapi',
		code,
		key: 'WEATHER_UNKNOWN_ERROR',
		message: payload.error?.message ?? '날씨 정보를 불러오는 중 오류가 발생했습니다.',
		retryable: true,
		status: 502
	}
}

export { normalizeWeatherApiError, type WeatherApiErrorPayload }
