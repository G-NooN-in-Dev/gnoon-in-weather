type ThemeMapMarkerTheme = {
	styleId: string
	rootClassName: string
	color: string
	activeColor: string
	focusRingColor: string
	iconHtml: string
	iconRotateDeg?: number
}

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type ThemeMapMarkerSelectHandler = (id: string) => void
type ThemeMapMarkerHoverChangeHandler = (hovered: boolean) => void
/* eslint-enable no-unused-vars */

type ThemeMapMarkerContentOptions = {
	id: string
	label: string
	ariaLabel: string
	theme: ThemeMapMarkerTheme
	onSelect: ThemeMapMarkerSelectHandler
	onHoverChange?: ThemeMapMarkerHoverChangeHandler
}

/**
 * CustomOverlay 마커용 인라인 스타일을 테마별로 한 번만 주입합니다.
 * 카카오 오버레이 DOM은 Tailwind 스캔 밖이라 전용 CSS를 씁니다.
 */
function ensureThemeMapMarkerStyles(theme: ThemeMapMarkerTheme) {
	if (typeof document === 'undefined') {
		return
	}

	if (document.getElementById(theme.styleId)) {
		return
	}

	const { rootClassName, color, activeColor, focusRingColor, iconRotateDeg = 0 } = theme
	const iconTransform = iconRotateDeg === 0 ? 'none' : `rotate(${iconRotateDeg}deg)`

	const style = document.createElement('style')
	style.id = theme.styleId
	style.textContent = `
		.${rootClassName} {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
		}
		.${rootClassName}:focus {
			outline: none;
		}
		.${rootClassName}:focus-visible .${rootClassName}-icon {
			box-shadow: 0 0 0 3px ${focusRingColor};
		}
		.${rootClassName}-tooltip {
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
		.${rootClassName}:hover .${rootClassName}-tooltip,
		.${rootClassName}:focus-visible .${rootClassName}-tooltip,
		.${rootClassName}[data-selected='true'] .${rootClassName}-tooltip {
			opacity: 1;
		}
		.${rootClassName}-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 9999px;
			background: #fff;
			border: 2px solid ${color};
			color: ${color};
			box-shadow: 0 2px 8px rgba(15, 23, 42, 0.16);
			transition: transform 120ms ease, background-color 120ms ease, border-color 120ms ease, color 120ms ease;
		}
		.${rootClassName}-icon svg {
			width: 16px;
			height: 16px;
			transform: ${iconTransform};
		}
		.${rootClassName}:hover .${rootClassName}-icon,
		.${rootClassName}[data-selected='true'] .${rootClassName}-icon {
			transform: scale(1.08);
			background: #fff;
			border-color: ${activeColor};
			color: ${activeColor};
		}
	`
	document.head.appendChild(style)
}

/**
 * 테마지도 CustomOverlay용 DOM을 만듭니다.
 * 호버·포커스·선택 시 아이콘 상단에 이름 툴팁을 표시합니다.
 * 툴팁이 다른 마커에 가리지 않도록 호버 변경은 지도 쪽 오버레이 zIndex와 맞춰 씁니다.
 */
function createThemeMapMarkerContent({
	id,
	label,
	ariaLabel,
	theme,
	onSelect,
	onHoverChange
}: ThemeMapMarkerContentOptions): HTMLElement {
	ensureThemeMapMarkerStyles(theme)

	const { rootClassName, iconHtml } = theme

	const root = document.createElement('div')
	root.className = rootClassName
	root.dataset.id = id
	root.dataset.selected = 'false'
	root.setAttribute('role', 'button')
	root.tabIndex = 0
	root.setAttribute('aria-label', ariaLabel)

	const tooltip = document.createElement('span')
	tooltip.className = `${rootClassName}-tooltip`
	tooltip.textContent = label

	const icon = document.createElement('span')
	icon.className = `${rootClassName}-icon`
	icon.setAttribute('aria-hidden', 'true')
	icon.innerHTML = iconHtml

	root.append(tooltip, icon)

	const select = (event: Event) => {
		event.stopPropagation()
		onSelect(id)
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

function setThemeMapMarkerSelected(content: HTMLElement, selected: boolean) {
	content.dataset.selected = selected ? 'true' : 'false'
}

export { createThemeMapMarkerContent, setThemeMapMarkerSelected }
export type { ThemeMapMarkerTheme }
