type ThemeMapPlace = {
	id: string
	name: string
	lat: number
	lng: number
}

type ThemeMapBoundsPadding = {
	top: number
	right: number
	bottom: number
	left: number
}

/** 공항 목록과 같은 수도권 기본 뷰 패딩 */
const THEME_MAP_METRO_BOUNDS_PADDING = {
	top: 72,
	right: 72,
	bottom: 72,
	left: 72
} as const satisfies ThemeMapBoundsPadding

/** 작은 컨테이너에서 한반도 전체가 들어가도록 패딩을 줄입니다. */
const THEME_MAP_KOREA_BOUNDS_PADDING = {
	top: 24,
	right: 24,
	bottom: 24,
	left: 24
} as const satisfies ThemeMapBoundsPadding

const DEFAULT_MARKER_Z_INDEX = 1
const SELECTED_MARKER_Z_INDEX = 10
/** 툴팁이 이웃 마커 오버레이 위에 오도록 호버 중인 마커만 더 올립니다. */
const HOVERED_MARKER_Z_INDEX = 20

function getThemeMapMarkerZIndex(id: string, selectedId: string | null, hoveredId: string | null): number {
	if (id === hoveredId) {
		return HOVERED_MARKER_Z_INDEX
	}

	return id === selectedId ? SELECTED_MARKER_Z_INDEX : DEFAULT_MARKER_Z_INDEX
}

/** 지정 장소들로 LatLngBounds를 만듭니다. */
function createPlacesLatLngBounds(
	kakaoMaps: typeof kakao.maps,
	places: readonly ThemeMapPlace[]
): kakao.maps.LatLngBounds {
	const seed = places[0]
	if (!seed) {
		throw new Error('지도 bounds를 만들 장소가 없습니다.')
	}

	const { LatLng, LatLngBounds } = kakaoMaps
	const bounds = new LatLngBounds(new LatLng(seed.lat, seed.lng), new LatLng(seed.lat, seed.lng))

	for (const place of places) {
		bounds.extend(new LatLng(place.lat, place.lng))
	}

	return bounds
}

export {
	createPlacesLatLngBounds,
	DEFAULT_MARKER_Z_INDEX,
	getThemeMapMarkerZIndex,
	THEME_MAP_KOREA_BOUNDS_PADDING,
	THEME_MAP_METRO_BOUNDS_PADDING
}
export type { ThemeMapBoundsPadding, ThemeMapPlace }
