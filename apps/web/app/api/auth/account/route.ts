import { NextResponse } from 'next/server'

import { createAuthError, isAuthApiError } from '@/lib/auth/errors'
import { clearSessionCookie, getCurrentUser } from '@/lib/auth/session.server'
import { deleteUserAccount } from '@/services/auth.service'
import type { AuthErrorResponse } from '@/types/auth.type'

type DeleteAccountSuccessResponse = {
	ok: true
}

async function DELETE() {
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

		await deleteUserAccount(currentUser.id)
		await clearSessionCookie()

		return NextResponse.json({ ok: true } satisfies DeleteAccountSuccessResponse)
	} catch (caught) {
		if (isAuthApiError(caught)) {
			return NextResponse.json({ error: caught } satisfies AuthErrorResponse, { status: caught.status })
		}

		const error = createAuthError({
			key: 'AUTH_INTERNAL_ERROR',
			message: '회원탈퇴 중 오류가 발생했습니다.',
			status: 500
		})

		return NextResponse.json({ error } satisfies AuthErrorResponse, { status: 500 })
	}
}

export { DELETE }
