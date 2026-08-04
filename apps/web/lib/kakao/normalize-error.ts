import { KAKAO_COMMON_ERROR_RULES } from '@/lib/kakao/error-rules'
import type { AppApiError } from '@/types/error.type'

type KakaoErrorPayload = {
	errorType?: string
	message?: string
	code?: number | string
	msg?: string
}

/** Kakao Local API 응답 에러를 앱 공통 에러 포맷으로 정규화합니다. */
function normalizeKakaoApiError(payload: KakaoErrorPayload): AppApiError {
	const code = payload.code ?? 0
	const rule = KAKAO_COMMON_ERROR_RULES[code]

	if (rule) {
		const { key, status, retryable, message } = rule
		return { provider: 'kakao', code: Number(code), key, message, retryable, status }
	}

	return {
		provider: 'kakao',
		code: Number(code),
		key: 'KAKAO_UNKNOWN_ERROR',
		message: payload.message ?? payload.msg ?? '카카오 위치 정보를 불러오는 중 오류가 발생했습니다.',
		retryable: true,
		status: 502
	}
}

export { normalizeKakaoApiError }
export type { KakaoErrorPayload }
