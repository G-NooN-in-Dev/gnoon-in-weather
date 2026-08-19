import {
	createThemeMapMarkerContent,
	setThemeMapMarkerSelected,
	type ThemeMapMarkerTheme
} from '@/features/theme-maps/components/theme-map-marker-content'
import { type BaseballPark, getBaseballParkHomeTeamLabel } from '@/features/theme-maps/lib/baseball-parks'

/** Lucide Lab baseball (viewBox 0 0 24 24) */
const BASEBALL_ICON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c5.5 0 10-4.5 10-10"/><circle cx="12" cy="12" r="10"/><path d="M22 12c-5.5 0-10 4.5-10 10"/><path d="m8 11.5-1.5-2"/><path d="m11.5 8-2-1.5"/><path d="m14.5 17.5-2-1.5"/><path d="m17.5 14.5-1.5-2"/></svg>`

const BASEBALL_MARKER_THEME = {
	styleId: 'baseball-marker-styles',
	rootClassName: 'baseball-marker',
	color: '#6cbd58',
	activeColor: '#5b9f4b',
	focusRingColor: 'rgba(34, 197, 94, 0.45)',
	iconHtml: BASEBALL_ICON_HTML
} as const satisfies ThemeMapMarkerTheme

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type BaseballParkSelectHandler = (id: string) => void
type BaseballParkHoverChangeHandler = (hovered: boolean) => void
/* eslint-enable no-unused-vars */

function createBaseballMarkerContent(
	park: BaseballPark,
	onSelect: BaseballParkSelectHandler,
	onHoverChange?: BaseballParkHoverChangeHandler
): HTMLElement {
	const { id, name } = park

	return createThemeMapMarkerContent({
		id,
		label: name,
		ariaLabel: `${name} (${getBaseballParkHomeTeamLabel(park)})`,
		theme: BASEBALL_MARKER_THEME,
		onSelect,
		onHoverChange
	})
}

function setBaseballMarkerSelected(content: HTMLElement, selected: boolean) {
	setThemeMapMarkerSelected(content, selected)
}

export { createBaseballMarkerContent, setBaseballMarkerSelected }
