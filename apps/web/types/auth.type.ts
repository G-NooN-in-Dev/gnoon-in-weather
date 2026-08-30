/** 클라이언트·세션에 노출하는 사용자 정보 (비밀번호 제외) */
type PublicUser = {
	id: string
	email: string
	nickname: string
}

/** JWT 세션 payload */
type AuthSessionPayload = {
	sub: string
	email: string
	nickname: string
}

type AuthApiErrorStatus = 400 | 401 | 409 | 500

/** 인증 API 공통 에러 응답 */
type AuthApiError = {
	key: string
	message: string
	status: AuthApiErrorStatus
	/** zod 필드별 메시지 (있을 때만) */
	fieldErrors?: Partial<Record<string, string>>
}

type AuthSuccessResponse = {
	user: PublicUser
}

type AuthErrorResponse = {
	error: AuthApiError
}

export type { AuthApiError, AuthApiErrorStatus, AuthErrorResponse, AuthSessionPayload, AuthSuccessResponse, PublicUser }
