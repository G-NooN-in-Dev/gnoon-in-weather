import { THEME_MAPS_NAV_ITEMS, THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

type NavChildLink = {
	href: string
	label: string
}

type NavItem = {
	href: string
	label: string
	/** 있으면 모바일 Sheet에서만 하위 링크로 표시 */
	children?: readonly NavChildLink[]
}

/** 메뉴 추가 시 여기만 확장하면 인라인·모바일 Sheet에 함께 반영됩니다 */
const NAV_ITEMS: NavItem[] = [
	{ href: '/', label: '홈' },
	{ href: '/weather-news', label: '날씨뉴스' },
	{
		href: THEME_MAPS_ROUTES.home,
		label: '테마지도',
		// 테마지도 하위 라우트 — 허브(/theme-maps)는 부모 링크로 충분해 제외
		children: THEME_MAPS_NAV_ITEMS.filter((item) => item.href !== THEME_MAPS_ROUTES.home).map((item) => {
			const { href, label } = item
			return { href, label }
		})
	},
	{ href: '/my', label: 'MY' }
]

export { NAV_ITEMS }
export type { NavChildLink, NavItem }
