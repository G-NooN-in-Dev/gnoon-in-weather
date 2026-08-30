import { NextResponse } from 'next/server'

import { createAuthError, isAuthApiError } from '@/lib/auth/errors'
import { signUpSchema } from '@/lib/auth/schemas'
import { setSessionCookie } from '@/lib/auth/session.server'
import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { signUpUser } from '@/services/auth.service'
import type { AuthErrorResponse, AuthSuccessResponse } from '@/types/auth.type'

async function POST(request: Request) {
	try {
		const body: unknown = await request.json()
		const parsed = signUpSchema.safeParse(body)

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

		const user = await signUpUser(parsed.data)
		await setSessionCookie(user)

		return NextResponse.json({ user } satisfies AuthSuccessResponse, { status: 201 })
	} catch (caught) {
		if (isAuthApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies AuthErrorResponse, { status: caught.status })
		}

		const error = createAuthError({
			key: 'AUTH_INTERNAL_ERROR',
			message: '회원가입 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies AuthErrorResponse, { status: 500 })
	}
}

export { POST }
