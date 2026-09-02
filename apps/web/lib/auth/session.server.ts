import { cookies } from 'next/headers'
import { cache } from 'react'

import { AUTH_SESSION_COOKIE_NAME, AUTH_SESSION_MAX_AGE_SECONDS } from '@/lib/auth/constants'
import { createSessionToken, verifySessionToken } from '@/lib/auth/session'
import { getUserById } from '@/services/auth.service'
import type { PublicUser } from '@/types/auth.type'

function sessionCookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
		maxAge
	}
}

/** 로그인 성공 후 HTTP-only 세션 쿠키를 설정합니다. */
async function setSessionCookie(user: PublicUser): Promise<void> {
	const token = await createSessionToken(user)
	const cookieStore = await cookies()

	cookieStore.set(AUTH_SESSION_COOKIE_NAME, token, sessionCookieOptions(AUTH_SESSION_MAX_AGE_SECONDS))
}

/** 로그아웃 시 세션 쿠키를 제거합니다. */
async function clearSessionCookie(): Promise<void> {
	const cookieStore = await cookies()

	cookieStore.set(AUTH_SESSION_COOKIE_NAME, '', sessionCookieOptions(0))
}

/**
 * 현재 요청의 세션 사용자 정보를 반환합니다.
 * JWT가 유효해도 DB에 유저가 없으면 세션을 비우고 null을 반환합니다.
 * Header·page 등 동일 요청 내 중복 호출은 React cache로 dedupe(중복 제거)합니다.
 */
const getCurrentUser = cache(async (): Promise<PublicUser | null> => {
	const cookieStore = await cookies()
	const token = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value

	if (!token) {
		return null
	}

	const session = await verifySessionToken(token)

	if (!session) {
		return null
	}

	const user = await getUserById(session.sub)

	if (!user) {
		// Server Component 렌더 중에는 쿠키 수정이 막힐 수 있음 — UI는 비로그인으로 처리
		try {
			await clearSessionCookie()
		} catch {
			// ignore
		}

		return null
	}

	return user
})

export { clearSessionCookie, getCurrentUser, setSessionCookie }
