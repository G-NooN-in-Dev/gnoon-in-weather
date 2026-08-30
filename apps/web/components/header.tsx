import { Button } from '@shared/ui/button'
import Link from 'next/link'

import AuthHeaderActions from '@/components/auth-header-actions'
import Logo from '@/components/logo'
import Nav from '@/components/nav'
import ThemeMapsNav from '@/components/theme-maps-nav'
import { getCurrentUser } from '@/lib/auth/session.server'

async function Header() {
	const user = await getCurrentUser()

	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			<div className="max-w-content container mx-auto flex h-14 w-full items-center justify-between">
				<div className="items-base flex gap-10">
					<Logo />
					<Nav />
				</div>
				<div>
					{user ? (
						<AuthHeaderActions nickname={user.nickname} />
					) : (
						<Link href="/sign-in">
							<Button className="cursor-pointer p-3">로그인 / 회원가입</Button>
						</Link>
					)}
				</div>
			</div>
			<ThemeMapsNav />
		</header>
	)
}

export default Header
