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
/** 기본 마커(테두리·아이콘)는 기존 파스텔 블루를 유지합니다. */
const AIRPORT_MARKER_COLOR = '#5b9fd4'
const AIRPORT_MARKER_ACTIVE_COLOR = '#4d85b2'
/** 현재 보고 있는 공항 배경색만 조금 더 진하게 둡니다. */
const AIRPORT_MARKER_SELECTED_COLOR = '#3b82f6'
const AIRPORT_MARKER_SELECTED_ACTIVE_COLOR = '#2563eb'

const AIRPORT_MARKER_THEME = {
	styleId: 'airport-marker-styles-v5',
	rootClassName: 'airport-marker',
	color: AIRPORT_MARKER_COLOR,
	activeColor: AIRPORT_MARKER_ACTIVE_COLOR,
	focusRingColor: 'rgba(59, 130, 246, 0.45)',
	iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${PLANE_PATH}"/></svg>`,
	iconRotateDeg: 45,
	iconSizePx: AIRPORT_MARKER_SIZE_PX,
	/** 현재 보고 있는 공항은 원형 배경을 채워 구분합니다. */
	extraCss: `
		.airport-marker[data-selected='true'] .airport-marker-icon {
			background: ${AIRPORT_MARKER_SELECTED_COLOR};
			border-color: ${AIRPORT_MARKER_SELECTED_COLOR};
			color: #fff;
			transform: none;
		}
		.airport-marker[data-selected='true']:hover .airport-marker-icon,
		.airport-marker[data-selected='true']:focus-visible .airport-marker-icon {
			background: ${AIRPORT_MARKER_SELECTED_ACTIVE_COLOR};
			border-color: ${AIRPORT_MARKER_SELECTED_ACTIVE_COLOR};
			color: #fff;
			transform: scale(1.08);
		}
		.airport-marker[data-selected='true'] .airport-marker-tooltip {
			opacity: 0;
		}
		.airport-marker[data-selected='true']:hover .airport-marker-tooltip,
		.airport-marker[data-selected='true']:focus-visible .airport-marker-tooltip {
			opacity: 1;
		}
	`
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
