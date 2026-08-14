/**
 * 카카오맵 JavaScript SDK 최소 타입.
 * 공식 SDK는 전역 `kakao`를 주입하므로, 이 프로젝트에서 쓰는 API만 선언합니다.
 */

export {}

declare global {
	namespace kakao {
		namespace maps {
			function load(callback: () => void): void

			class LatLng {
				constructor(latitude: number, longitude: number)
				getLat(): number
				getLng(): number
			}

			class LatLngBounds {
				constructor(sw: LatLng, ne: LatLng)
				extend(latlng: LatLng): LatLngBounds
				getSouthWest(): LatLng
				getNorthEast(): LatLng
			}

			class Map {
				constructor(container: HTMLElement, options: MapOptions)
				setCenter(latlng: LatLng): void
				getCenter(): LatLng
				setLevel(level: number): void
				getLevel(): number
				setBounds(
					bounds: LatLngBounds,
					paddingTop?: number,
					paddingRight?: number,
					paddingBottom?: number,
					paddingLeft?: number
				): void
				setDraggable(draggable: boolean): void
				setZoomable(zoomable: boolean): void
				relayout(): void
			}

			interface MapOptions {
				center: LatLng
				level?: number
				draggable?: boolean
				scrollwheel?: boolean
				disableDoubleClick?: boolean
				disableDoubleClickZoom?: boolean
				keyboardShortcuts?: boolean
			}

			interface CustomOverlayOptions {
				map?: Map | null
				clickable?: boolean
				content: HTMLElement | string
				position: LatLng
				xAnchor?: number
				yAnchor?: number
				zIndex?: number
			}

			class CustomOverlay {
				constructor(options: CustomOverlayOptions)
				setMap(map: Map | null): void
				getMap(): Map | null
				setPosition(position: LatLng): void
				getPosition(): LatLng
				setContent(content: HTMLElement | string): void
				getContent(): HTMLElement | string
				setVisible(visible: boolean): void
				getVisible(): boolean
				setZIndex(zIndex: number): void
			}

			namespace event {
				function addListener(target: Map | CustomOverlay, type: string, handler: (...args: unknown[]) => void): void
				function removeListener(target: Map | CustomOverlay, type: string, handler: (...args: unknown[]) => void): void
			}
		}
	}

	interface Window {
		kakao: typeof kakao
	}
}
