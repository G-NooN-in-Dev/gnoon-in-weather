import { Button } from '@shared/ui/button'
import Link from 'next/link'

import Logo from './logo'
import Nav from './nav'
import ThemeMapsNav from './theme-maps-nav'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			<div className="max-w-content container mx-auto flex h-14 w-full items-center justify-between">
				<div className="items-base flex gap-10">
					<Logo />
					<Nav />
				</div>
				<div>
					<Link href="/sign-in">
						<Button className="cursor-pointer p-3 text-lg">로그인 / 회원가입</Button>
					</Link>
				</div>
			</div>
			<ThemeMapsNav />
		</header>
	)
}

export default Header
