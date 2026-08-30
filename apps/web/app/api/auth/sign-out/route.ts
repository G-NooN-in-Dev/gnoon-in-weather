import { NextResponse } from 'next/server'

import { clearSessionCookie } from '@/lib/auth/session.server'

async function POST() {
	await clearSessionCookie()

	return NextResponse.json({ ok: true })
}

export { POST }
