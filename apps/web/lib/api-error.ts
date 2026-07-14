import type { AppApiError } from '@/types/error.type'

/**
 * 서비스·에러 정규화 함수에서 throw한 AppApiError 객체인지 판별합니다.
 * Route Handler catch 블록에서 공통 응답 포맷으로 변환할 때 사용합니다.
 */
function isAppApiError(error: unknown): error is AppApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'provider' in error &&
		'key' in error &&
		'status' in error &&
		'message' in error &&
		'retryable' in error &&
		'code' in error
	)
}

export { isAppApiError }
