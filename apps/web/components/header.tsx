import { Suspense } from 'react'

import HeaderAuthServer from '@/components/header-auth.server'
import Logo from '@/components/logo'
import Nav from '@/components/nav'
import ThemeMapsNav from '@/components/theme-maps-nav'

import { HeaderAuthSkeleton, NavSkeleton } from './skeletons/layout-skeletons'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			<div className="max-w-content container mx-auto flex h-14 w-full items-center justify-between">
				<div className="items-base flex gap-10">
					<Logo />
					<Suspense fallback={<NavSkeleton />}>
						<Nav />
					</Suspense>
				</div>
				<div>
					<Suspense fallback={<HeaderAuthSkeleton />}>
						<HeaderAuthServer />
					</Suspense>
				</div>
			</div>
			<Suspense fallback={null}>
				<ThemeMapsNav />
			</Suspense>
		</header>
	)
}

export default Header
