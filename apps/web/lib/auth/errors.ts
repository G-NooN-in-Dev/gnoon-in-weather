import type { AuthApiError, AuthApiErrorStatus } from '@/types/auth.type'

type CreateAuthErrorInput = {
	key: string
	message: string
	status: AuthApiErrorStatus
	fieldErrors?: AuthApiError['fieldErrors']
}

/** Auth API에서 throw·응답에 쓰는 에러 객체를 만듭니다. */
function createAuthError({ key, message, status, fieldErrors }: CreateAuthErrorInput): AuthApiError {
	return {
		key,
		message,
		status,
		...(fieldErrors ? { fieldErrors } : {})
	}
}

function isAuthApiError(error: unknown): error is AuthApiError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'key' in error &&
		'message' in error &&
		'status' in error &&
		typeof (error as AuthApiError).key === 'string' &&
		typeof (error as AuthApiError).message === 'string' &&
		typeof (error as AuthApiError).status === 'number'
	)
}

export { createAuthError, isAuthApiError }
