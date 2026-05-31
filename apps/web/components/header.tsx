import { Button } from '@shared/ui/button'
import Link from 'next/link'

import Logo from './logo'
import Nav from './nav'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			<div className="container mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between">
				<div className="flex items-center gap-10">
					<Logo />
					<Nav />
				</div>
				{/* TODO - 로그인/회원가입 */}
				<div className="mt-1">
					<Link href="/sign-in">
						<Button className="cursor-pointer p-5 text-lg">로그인 / 회원가입</Button>
					</Link>
				</div>
			</div>
		</header>
	)
}

export default Header
