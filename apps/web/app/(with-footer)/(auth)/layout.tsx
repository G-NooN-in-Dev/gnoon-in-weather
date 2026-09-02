import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

import { getCurrentUser } from '@/lib/auth/session.server'

async function AuthLayout({ children }: PropsWithChildren) {
	const user = await getCurrentUser()

	if (user) {
		redirect('/')
	}

	return children
}

export default AuthLayout
