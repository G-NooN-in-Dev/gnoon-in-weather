import { Button } from '@shared/ui/button'
import Link from 'next/link'

import AuthHeaderActions from '@/components/auth-header-actions'
import { getCurrentUser } from '@/lib/auth/session.server'

async function HeaderAuthServer() {
	const user = await getCurrentUser()

	if (user) {
		return <AuthHeaderActions nickname={user.nickname} />
	}

	return (
		<Link href="/sign-in">
			<Button className="cursor-pointer p-3">로그인 / 회원가입</Button>
		</Link>
	)
}

export default HeaderAuthServer
