import {
	createThemeMapMarkerContent,
	setThemeMapMarkerSelected,
	type ThemeMapMarkerTheme
} from '@/features/theme-maps/components/theme-map-marker-content'
import type { Airport } from '@/features/theme-maps/lib/airports'

/** Lucide Plane path (viewBox 0 0 24 24) */
const PLANE_PATH =
	'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z'

const AIRPORT_MARKER_SIZE_PX = 36

const AIRPORT_MARKER_THEME = {
	styleId: 'airport-marker-styles',
	rootClassName: 'airport-marker',
	color: '#5b9fd4',
	activeColor: '#4d85b2',
	focusRingColor: 'rgba(59, 130, 246, 0.45)',
	iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${PLANE_PATH}"/></svg>`,
	iconRotateDeg: 45,
	iconSizePx: AIRPORT_MARKER_SIZE_PX
} as const satisfies ThemeMapMarkerTheme

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
type AirportHoverChangeHandler = (hovered: boolean) => void
/* eslint-enable no-unused-vars */

function createAirportMarkerContent(
	airport: Airport,
	onSelect: AirportSelectHandler,
	onHoverChange?: AirportHoverChangeHandler
): HTMLElement {
	const { iata, name } = airport

	return createThemeMapMarkerContent({
		id: iata,
		label: name,
		ariaLabel: `${name} (${iata})`,
		theme: AIRPORT_MARKER_THEME,
		onSelect,
		onHoverChange
	})
}

function setAirportMarkerSelected(content: HTMLElement, selected: boolean) {
	setThemeMapMarkerSelected(content, selected)
}

export { createAirportMarkerContent, setAirportMarkerSelected }
