'use client'

import { cn } from '@shared/ui/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { THEME_MAPS_NAV_ITEMS, THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

const isThemeMapsNavActive = (pathname: string, href: string) => {
	if (href === THEME_MAPS_ROUTES.home) return pathname === href
	return pathname === href || pathname.startsWith(`${href}/`)
}

function ThemeMapsNav() {
	const pathname = usePathname()

	if (!pathname.startsWith(THEME_MAPS_ROUTES.home)) return null

	// lg 미만은 헤더 MobileNav Sheet의 테마지도 하위 메뉴로 대체
	return (
		<nav
			aria-label="테마지도"
			className="text-grayscale-500 border-grayscale-200 hidden border-t text-xl font-medium lg:block"
		>
			<div className="max-w-content container mx-auto flex h-12 w-full min-w-0 items-center gap-8 px-4 md:px-6">
				{THEME_MAPS_NAV_ITEMS.map(({ href, label }) => {
					const active = isThemeMapsNavActive(pathname, href)

					return (
						<Link
							key={href}
							href={href}
							aria-current={active ? 'page' : undefined}
							className={cn(
								'relative inline-block whitespace-nowrap',
								active && [
									'font-semibold text-black',
									"after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:mt-1 after:block after:h-0.5 after:bg-black after:content-['']"
								]
							)}
						>
							{label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}

export default ThemeMapsNav
