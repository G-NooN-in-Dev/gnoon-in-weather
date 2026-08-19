import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'

/**
 * 전역 푸터를 숨기는 경로.
 */
const FOOTER_HIDDEN_PATHS = [THEME_MAPS_ROUTES.airports, THEME_MAPS_ROUTES.baseball] as const

function hideFooter(pathname: string) {
	return FOOTER_HIDDEN_PATHS.some((path) => path === pathname)
}

export { FOOTER_HIDDEN_PATHS, hideFooter }
