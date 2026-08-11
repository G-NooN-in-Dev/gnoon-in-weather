const THEME_MAPS_ROUTES = {
	home: '/theme-maps',
	airports: '/theme-maps/airports',
	baseball: '/theme-maps/baseball'
} as const

const THEME_MAPS_NAV_ITEMS = [
	{ href: THEME_MAPS_ROUTES.home, label: '홈' },
	{ href: THEME_MAPS_ROUTES.airports, label: '공항' },
	{ href: THEME_MAPS_ROUTES.baseball, label: '야구장' }
] as const

export { THEME_MAPS_NAV_ITEMS, THEME_MAPS_ROUTES }
