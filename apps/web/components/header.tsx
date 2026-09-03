import { Suspense } from 'react'

import HeaderAuthServer from '@/components/header-auth.server'
import { MobileNavWithLogo, Nav } from '@/components/nav'
import ThemeMapsNav from '@/components/theme-maps-nav'

import { HeaderAuthSkeleton, NavSkeleton } from './skeletons/layout-skeletons'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 bg-white">
			{/* min-w-0: 좁은 화면에서 로고+메뉴가 뷰포트를 넘기지 않도록 보완 */}
			<div className="max-w-content container mx-auto flex h-14 w-full min-w-0 items-center gap-3 pr-4 pl-2 md:pr-6 md:pl-4 lg:gap-8">
				<div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-8">
					<MobileNavWithLogo />
					<Suspense fallback={<NavSkeleton />}>
						<Nav />
					</Suspense>
				</div>
				<div className="shrink-0">
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
