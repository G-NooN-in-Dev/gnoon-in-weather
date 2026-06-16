/** 외부 API 공급자 식별자 */
export type AppApiErrorProvider = 'weatherapi' | 'kakao' | 'naver'

/** 앱에서 공통으로 사용하는 HTTP 에러 상태 */
export type AppApiErrorStatus = 400 | 401 | 403 | 404 | 500 | 502 | 503 | 504

/** 공급자별 원본 에러를 공통 포맷으로 정규화한 타입 */
export type AppApiError = {
	/** 어느 공급자에서 발생한 에러인지 구분합니다. */
	provider: AppApiErrorProvider
	/** 공급자 문서 기준 원본 에러 코드입니다. */
	code: number
	/** 프론트/로깅에서 식별 가능한 내부 키입니다. */
	key: string
	/** 사용자에게 노출 가능한 한국어 메시지입니다. */
	message: string
	/** 동일 요청 재시도 가능 여부를 나타냅니다. */
	retryable: boolean
	/** 앱 내부에서 사용하는 표준 HTTP 상태 코드입니다. */
	status: AppApiErrorStatus
}

/** 공급자 에러 코드별 정규화 규칙 */
export type AppApiErrorRule = {
	key: string
	status: AppApiErrorStatus
	retryable: boolean
	message: string
}
