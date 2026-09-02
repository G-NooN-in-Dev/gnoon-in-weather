import { NextRequest, NextResponse } from 'next/server'

import { createAuthError } from '@/lib/auth/errors'
import { nicknameSchema } from '@/lib/auth/schemas'
import { fieldErrorsFromZod } from '@/lib/auth/zod-utils'
import { isNicknameAvailable } from '@/services/auth.service'
import type { AuthErrorResponse } from '@/types/auth.type'

type NicknameAvailabilityResponse = {
	available: boolean
}

/** 회원가입 전 닉네임 사용 가능 여부를 확인합니다. */
async function GET(request: NextRequest) {
	const nickname = request.nextUrl.searchParams.get('nickname') ?? ''
	const parsed = nicknameSchema.safeParse(nickname)

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

	const available = await isNicknameAvailable(parsed.data)

	return NextResponse.json({ available } satisfies NicknameAvailabilityResponse)
}

export { GET }
