import { Skeleton } from '@shared/ui/skeleton'
import { Suspense } from 'react'

import HeaderAuthServer from '@/components/header-auth.server'
import Logo from '@/components/logo'
import Nav from '@/components/nav'
import ThemeMapsNav from '@/components/theme-maps-nav'

function HeaderAuthFallback() {
	return <Skeleton className="h-10 w-36 rounded-lg" aria-hidden />
}

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			<div className="max-w-content container mx-auto flex h-14 w-full items-center justify-between">
				<div className="items-base flex gap-10">
					<Logo />
					<Nav />
				</div>
				<div>
					<Suspense fallback={<HeaderAuthFallback />}>
						<HeaderAuthServer />
					</Suspense>
				</div>
			</div>
			<ThemeMapsNav />
		</header>
	)
}

export default Header
