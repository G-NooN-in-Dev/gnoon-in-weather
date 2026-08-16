import type { Airport } from '@/features/theme-maps/lib/airports'

/** Lucide Plane path (viewBox 0 0 24 24) */
const PLANE_PATH =
	'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z'

const MARKER_STYLE_ID = 'airport-marker-styles'

/**
 * CustomOverlay 마커용 인라인 스타일을 문서에 한 번만 주입합니다.
 * 카카오 오버레이 DOM은 Tailwind 스캔 밖이라 전용 CSS를 씁니다.
 */
function ensureAirportMarkerStyles() {
	if (typeof document === 'undefined') {
		return
	}

	if (document.getElementById(MARKER_STYLE_ID)) {
		return
	}

	const style = document.createElement('style')
	style.id = MARKER_STYLE_ID
	style.textContent = `
		.airport-marker {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
		}
		.airport-marker:focus {
			outline: none;
		}
		.airport-marker:focus-visible .airport-marker-icon {
			box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
		}
		.airport-marker-tooltip {
			position: absolute;
			bottom: calc(100% + 6px);
			left: 50%;
			transform: translateX(-50%);
			padding: 4px 8px;
			border-radius: 6px;
			background: rgba(15, 23, 42, 0.92);
			color: #fff;
			font-size: 12px;
			font-weight: 500;
			line-height: 1.2;
			white-space: nowrap;
			opacity: 0;
			pointer-events: none;
			transition: opacity 120ms ease;
			z-index: 2;
		}
		.airport-marker:hover .airport-marker-tooltip,
		.airport-marker:focus-visible .airport-marker-tooltip,
		.airport-marker[data-selected='true'] .airport-marker-tooltip {
			opacity: 1;
		}
		.airport-marker-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 9999px;
			background: #fff;
			border: 2px solid #5b9fd4;
			color: #5b9fd4;
			box-shadow: 0 2px 8px rgba(15, 23, 42, 0.16);
			transition: transform 120ms ease, background-color 120ms ease, border-color 120ms ease, color 120ms ease;
		}
		.airport-marker-icon svg {
			width: 16px;
			height: 16px;
			transform: rotate(45deg);
		}
		.airport-marker:hover .airport-marker-icon,
		.airport-marker[data-selected='true'] .airport-marker-icon {
			transform: scale(1.08);
			background: #fff;
			border-color: #4d85b2;
			color: #4d85b2;
		}
	`
	document.head.appendChild(style)
}

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
type AirportHoverChangeHandler = (hovered: boolean) => void
/* eslint-enable no-unused-vars */

/**
 * 공항 CustomOverlay용 DOM을 만듭니다.
 * 호버·포커스·선택 시 아이콘 상단에 공항 이름 툴팁을 표시합니다.
 * 툴팁이 다른 마커에 가리지 않도록 호버 변경은 지도 쪽 오버레이 zIndex와 맞춰 씁니다.
 */
function createAirportMarkerContent(
	airport: Airport,
	onSelect: AirportSelectHandler,
	onHoverChange?: AirportHoverChangeHandler
): HTMLElement {
	const { iata, name } = airport

	ensureAirportMarkerStyles()

	const root = document.createElement('div')
	root.className = 'airport-marker'
	root.dataset.iata = iata
	root.dataset.selected = 'false'
	root.setAttribute('role', 'button')
	root.tabIndex = 0
	root.setAttribute('aria-label', `${name} (${iata})`)

	const tooltip = document.createElement('span')
	tooltip.className = 'airport-marker-tooltip'
	tooltip.textContent = name

	const icon = document.createElement('span')
	icon.className = 'airport-marker-icon'
	icon.setAttribute('aria-hidden', 'true')
	icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${PLANE_PATH}"/></svg>`

	root.append(tooltip, icon)

	const select = (event: Event) => {
		event.stopPropagation()
		onSelect(iata)
	}

	root.addEventListener('click', select)
	root.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			select(event)
		}
	})

	if (onHoverChange) {
		root.addEventListener('mouseenter', () => {
			onHoverChange(true)
		})
		root.addEventListener('mouseleave', () => {
			onHoverChange(false)
		})
		root.addEventListener('focus', () => {
			onHoverChange(true)
		})
		root.addEventListener('blur', () => {
			onHoverChange(false)
		})
	}

	return root
}

function setAirportMarkerSelected(content: HTMLElement, selected: boolean) {
	content.dataset.selected = selected ? 'true' : 'false'
}

export { createAirportMarkerContent, setAirportMarkerSelected }
