import { flattenError } from 'zod'

import { signInSchema, signUpSchema } from '@/lib/auth/schemas'
import type { AuthApiError, AuthErrorResponse, AuthSuccessResponse, PublicUser } from '@/types/auth.type'

import { AUTH_API_BASE_URL } from './constants'

type AuthFormResult =
	| { ok: true; user: PublicUser }
	| { ok: false; message: string; fieldErrors: Partial<Record<string, string>> }

async function parseAuthResponse(response: Response): Promise<AuthFormResult> {
	const payload = (await response.json()) as AuthSuccessResponse | AuthErrorResponse

	if ('user' in payload && payload.user) {
		return { ok: true, user: payload.user }
	}

	if ('error' in payload && payload.error) {
		const error = payload.error satisfies AuthApiError

		return {
			ok: false,
			message: error.message,
			fieldErrors: error.fieldErrors ?? {}
		}
	}

	return {
		ok: false,
		message: '요청을 처리하지 못했습니다.',
		fieldErrors: {}
	}
}

/** 클라이언트에서 로그인 API를 호출합니다. */
async function requestSignIn(input: unknown): Promise<AuthFormResult> {
	const parsedUserData = signInSchema.safeParse(input)

	if (!parsedUserData.success) {
		const flattenedErrors = flattenError(parsedUserData.error)

		return {
			ok: false,
			message: '입력값을 확인해 주세요.',
			fieldErrors: Object.fromEntries(
				Object.entries(flattenedErrors.fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? ''])
			)
		}
	}

	const response = await fetch(`${AUTH_API_BASE_URL}/sign-in`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(parsedUserData.data)
	})

	return parseAuthResponse(response)
}

/** 클라이언트에서 회원가입 API를 호출합니다. */
async function requestSignUp(input: unknown): Promise<AuthFormResult> {
	const parsedUserData = signUpSchema.safeParse(input)

	if (!parsedUserData.success) {
		const flattenedErrors = flattenError(parsedUserData.error)

		return {
			ok: false,
			message: '입력값을 확인해 주세요.',
			fieldErrors: Object.fromEntries(
				Object.entries(flattenedErrors.fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? ''])
			)
		}
	}

	const response = await fetch(`${AUTH_API_BASE_URL}/sign-up`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(parsedUserData.data)
	})

	return parseAuthResponse(response)
}

/** 클라이언트에서 로그아웃 API를 호출합니다. */
async function requestSignOut(): Promise<void> {
	await fetch(`${AUTH_API_BASE_URL}/sign-out`, { method: 'POST' })
}

export { requestSignIn, requestSignOut, requestSignUp }
export type { AuthFormResult }
