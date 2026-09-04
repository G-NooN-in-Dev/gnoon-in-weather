import { Skeleton } from '@shared/ui/skeleton'

import Logo from '@/components/logo'
import { NAV_ITEMS } from '@/components/nav.constants'

function HeaderAuthSkeleton() {
	return <Skeleton className="h-10 w-36 rounded-lg" aria-hidden />
}

function MobileNavWithLogoSkeleton() {
	return (
		<>
			<Skeleton className="size-8 shrink-0 rounded-md lg:hidden" aria-hidden />
			<Logo />
		</>
	)
}

function NavSkeleton() {
	return (
		<nav className="text-grayscale-500 hidden items-center gap-6 text-xl font-medium lg:flex" aria-hidden>
			{NAV_ITEMS.map((item) => (
				<span key={item.href} className="relative inline-block">
					{item.label}
				</span>
			))}
		</nav>
	)
}

export { HeaderAuthSkeleton, MobileNavWithLogoSkeleton, NavSkeleton }
