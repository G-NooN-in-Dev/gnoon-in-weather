'use client'

import { cn } from '@shared/ui/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
	{ href: '/', label: '홈' },
	{ href: '/weather-news', label: '날씨뉴스' },
	{ href: '/theme-maps', label: '테마지도' },
	{ href: '/my', label: 'MY' }
] as const

const isNavActive = (pathname: string, href: string) => {
	if (href === '/') return pathname === '/'
	return pathname === href || pathname.startsWith(`${href}/`)
}

function Nav() {
	const pathname = usePathname()

	return (
		<nav className="text-grayscale-500 flex items-center gap-10 pt-1 text-2xl font-medium">
			{NAV_ITEMS.map((item) => {
				const { href, label } = item
				const active = isNavActive(pathname, href)

				return (
					<Link
						key={href}
						href={href}
						className={cn(
							'relative inline-block',
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
		</nav>
	)
}

export default Nav
