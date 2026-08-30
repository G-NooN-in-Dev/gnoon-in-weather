import { NextResponse } from 'next/server'

import { createAuthError, isAuthApiError } from '@/lib/auth/errors'
import { updateNicknameSchema } from '@/lib/auth/schemas'
import { getCurrentUser, setSessionCookie } from '@/lib/auth/session.server'
import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { updateUserNickname } from '@/services/auth.service'
import type { AuthErrorResponse, AuthSuccessResponse } from '@/types/auth.type'

async function PATCH(request: Request) {
	try {
		const currentUser = await getCurrentUser()

		if (!currentUser) {
			const error = createAuthError({
				key: 'AUTH_UNAUTHORIZED',
				message: '로그인이 필요합니다.',
				status: 401
			})

			return NextResponse.json({ error } satisfies AuthErrorResponse, { status: 401 })
		}

		const body: unknown = await request.json()
		const parsed = updateNicknameSchema.safeParse(body)

		if (!parsed.success) {
			const fieldErrors = fieldErrorsFromZod(parsed.error)
			const error = createAuthError({
				key: 'AUTH_VALIDATION_ERROR',
				message: '입력값을 확인해 주세요.',
				status: 400,
				fieldErrors
			})

			return NextResponse.json({ error } satisfies AuthErrorResponse, { status: 400 })
		}

		const { nickname } = parsed.data
		const user = await updateUserNickname(currentUser.id, nickname)

		await setSessionCookie(user)

		return NextResponse.json({ user } satisfies AuthSuccessResponse)
	} catch (caught) {
		if (isAuthApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies AuthErrorResponse, { status: caught.status })
		}

		const error = createAuthError({
			key: 'AUTH_INTERNAL_ERROR',
			message: '닉네임 변경 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies AuthErrorResponse, { status: 500 })
	}
}

export { PATCH }
