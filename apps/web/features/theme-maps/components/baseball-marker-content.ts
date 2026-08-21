import {
	createThemeMapMarkerContent,
	setThemeMapMarkerSelected,
	type ThemeMapMarkerTheme
} from '@/features/theme-maps/components/theme-map-marker-content'
import {
	type BaseballPark,
	type BaseballParkMapFilter,
	getBaseballParkHomeTeamsForFilter
} from '@/features/theme-maps/lib/baseball-parks'
import type { BaseballTeam } from '@/features/theme-maps/lib/baseball-teams'

/** Lucide Lab baseball (viewBox 0 0 24 24) */
const BASEBALL_ICON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c5.5 0 10-4.5 10-10"/><circle cx="12" cy="12" r="10"/><path d="M22 12c-5.5 0-10 4.5-10 10"/><path d="m8 11.5-1.5-2"/><path d="m11.5 8-2-1.5"/><path d="m14.5 17.5-2-1.5"/><path d="m17.5 14.5-1.5-2"/></svg>`

const LOGO_MARKER_SIZE_PX = 44

const BASEBALL_MARKER_THEME = {
	styleId: 'baseball-marker-styles',
	rootClassName: 'baseball-marker',
	color: '#6cbd58',
	activeColor: '#5b9f4b',
	focusRingColor: 'rgba(34, 197, 94, 0.45)',
	iconHtml: BASEBALL_ICON_HTML,
	extraCss: `
		.baseball-marker-icon[data-logo-count] {
			width: auto;
			height: auto;
			min-width: ${LOGO_MARKER_SIZE_PX}px;
			min-height: ${LOGO_MARKER_SIZE_PX}px;
			padding: 0;
			border: none;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			color: transparent;
			gap: 6px;
			overflow: visible;
		}
		.baseball-marker-icon[data-logo-count] img {
			width: ${LOGO_MARKER_SIZE_PX}px;
			height: ${LOGO_MARKER_SIZE_PX}px;
			object-fit: contain;
			display: block;
			pointer-events: none;
			/* 밝은 지도 타일 위에서도 로고 윤곽이 보이게 */
			filter:
				drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95))
				drop-shadow(0 1px 3px rgba(15, 23, 42, 0.45));
			transition: filter 120ms ease, transform 120ms ease;
		}
		.baseball-marker:hover .baseball-marker-icon[data-logo-count],
		.baseball-marker[data-selected='true'] .baseball-marker-icon[data-logo-count] {
			background: transparent;
			border: none;
			transform: scale(1.12);
		}
		.baseball-marker:hover .baseball-marker-icon[data-logo-count] img,
		.baseball-marker[data-selected='true'] .baseball-marker-icon[data-logo-count] img {
			filter:
				drop-shadow(0 0 2px rgba(255, 255, 255, 1))
				drop-shadow(0 2px 6px rgba(15, 23, 42, 0.5));
		}
		.baseball-marker:focus-visible .baseball-marker-icon[data-logo-count] {
			box-shadow: none;
			outline: 3px solid rgba(34, 197, 94, 0.45);
			outline-offset: 2px;
			border-radius: 4px;
		}
	`
} as const satisfies ThemeMapMarkerTheme

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type BaseballParkSelectHandler = (id: string) => void
type BaseballParkHoverChangeHandler = (hovered: boolean) => void
/* eslint-enable no-unused-vars */

function buildBaseballMarkerIconHtml(teams: readonly BaseballTeam[]): string {
	if (teams.length === 0) {
		return BASEBALL_ICON_HTML
	}

	return teams
		.map(
			({ logoSrc, name }) =>
				`<img src="${logoSrc}" alt="" title="${name}" width="${LOGO_MARKER_SIZE_PX}" height="${LOGO_MARKER_SIZE_PX}" draggable="false" decoding="async" />`
		)
		.join('')
}

function createBaseballMarkerContent(
	park: BaseballPark,
	filter: BaseballParkMapFilter,
	onSelect: BaseballParkSelectHandler,
	onHoverChange?: BaseballParkHoverChangeHandler
): HTMLElement {
	const { id, name } = park
	const teams = getBaseballParkHomeTeamsForFilter(park, filter)

	const root = createThemeMapMarkerContent({
		id,
		label: name,
		ariaLabel: `${name} (${teams.map((team) => team.name).join(' / ')})`,
		theme: {
			...BASEBALL_MARKER_THEME,
			iconHtml: buildBaseballMarkerIconHtml(teams)
		},
		onSelect,
		onHoverChange
	})

	const icon = root.querySelector<HTMLElement>('.baseball-marker-icon')
	if (icon) {
		icon.dataset.logoCount = String(Math.min(teams.length, 2))
	}

	return root
}

function setBaseballMarkerSelected(content: HTMLElement, selected: boolean) {
	setThemeMapMarkerSelected(content, selected)
}

export { createBaseballMarkerContent, setBaseballMarkerSelected }
