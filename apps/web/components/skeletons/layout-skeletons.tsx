import { Skeleton } from '@shared/ui/skeleton'

import { THEME_MAPS_NAV_ITEMS } from '@/features/theme-maps/lib/theme-maps-routes'

function HeaderAuthSkeleton() {
	return <Skeleton className="h-10 w-36 rounded-lg" aria-hidden />
}

function NavSkeleton() {
	return (
		<nav className="text-grayscale-500 flex items-center gap-6 text-xl font-medium" aria-hidden>
			{THEME_MAPS_NAV_ITEMS.map((item) => (
				<span key={item.href} className="relative inline-block">
					{item.label}
				</span>
			))}
		</nav>
	)
}

export { HeaderAuthSkeleton, NavSkeleton }
