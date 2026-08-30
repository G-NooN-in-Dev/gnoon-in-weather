import { jwtVerify, SignJWT } from 'jose'

import { AUTH_SESSION_MAX_AGE_SECONDS } from '@/lib/auth/constants'
import type { AuthSessionPayload, PublicUser } from '@/types/auth.type'

function getAuthSecretKey(): Uint8Array {
	const secret = process.env.AUTH_SECRET

	if (!secret) {
		throw new Error('AUTH_SECRET 환경 변수가 설정되지 않았습니다.')
	}

	return new TextEncoder().encode(secret)
}

/** 공개 사용자 정보로 서명된 JWT 세션 토큰을 만듭니다. */
async function createSessionToken(user: PublicUser): Promise<string> {
	const { email, id, nickname } = user

	return new SignJWT({ email, nickname } satisfies Omit<AuthSessionPayload, 'sub'>)
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(id)
		.setIssuedAt()
		.setExpirationTime(`${AUTH_SESSION_MAX_AGE_SECONDS}s`)
		.sign(getAuthSecretKey())
}

/** JWT 세션 토큰을 검증하고 payload를 반환합니다. 실패 시 null. */
async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getAuthSecretKey())

		if (typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.nickname !== 'string') {
			return null
		}

		return {
			sub: payload.sub,
			email: payload.email,
			nickname: payload.nickname
		} satisfies AuthSessionPayload
	} catch {
		return null
	}
}

/** 세션 payload → 클라이언트에 노출 가능한 사용자 정보 */
function toPublicUser(session: AuthSessionPayload): PublicUser {
	const { email, nickname, sub } = session

	return { id: sub, email, nickname }
}

export { createSessionToken, toPublicUser, verifySessionToken }
