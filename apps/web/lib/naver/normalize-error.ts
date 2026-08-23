import { NAVER_NEWS_ERROR_RULES } from '@/lib/naver/error-rules'
import type { AppApiError } from '@/types/error.type'

type NaverErrorPayload = {
	errorMessage?: string
	errorCode?: string
}

/** 네이버 검색 API 응답 에러를 앱 공통 에러 포맷으로 정규화합니다. */
function normalizeNaverApiError(payload: NaverErrorPayload, httpStatus: number): AppApiError {
	const code = payload.errorCode ?? String(httpStatus)
	const rule = NAVER_NEWS_ERROR_RULES[code]

	if (rule) {
		const { key, status, retryable, message } = rule
		return { provider: 'naver', code: 0, key, message, retryable, status }
	}

	return {
		provider: 'naver',
		code: 0,
		key: 'NAVER_UNKNOWN_ERROR',
		message: payload.errorMessage ?? '네이버 뉴스 검색 중 오류가 발생했습니다.',
		retryable: true,
		status: 502
	}
}

export { normalizeNaverApiError }
export type { NaverErrorPayload }
