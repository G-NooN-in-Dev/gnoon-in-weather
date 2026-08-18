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

/**
 * mainland: 제주를 뺀 서울~부산 뷰. 목록 지도와 야구장 피커.
 * korea: 제주를 포함한 한반도 뷰. 공항 피커.
 */
type ThemeMapBoundsMode = 'mainland' | 'korea'

type ThemeMapBoundsView = {
	padding: ThemeMapBoundsPadding
	southOffsetDeg: number
}

/** 제주 제외(서울~부산) 목록 지도 패딩 */
const THEME_MAP_MAINLAND_BOUNDS_PADDING = {
	top: 72,
	right: 72,
	bottom: 72,
	left: 72
} as const satisfies ThemeMapBoundsPadding

/** 서울~부산 맞춤 뒤 중심만 남쪽으로 살짝 옮깁니다. 줌은 유지합니다. */
const THEME_MAP_SOUTH_FOCUS_OFFSET_DEG = 0.3

/** 제주 포함 한반도 뷰. 작은 공항 피커에서 잘리지 않도록 패딩을 줄입니다. */
const THEME_MAP_KOREA_BOUNDS_PADDING = {
	top: 24,
	right: 24,
	bottom: 24,
	left: 24
} as const satisfies ThemeMapBoundsPadding

function getThemeMapBoundsView(mode: ThemeMapBoundsMode): ThemeMapBoundsView {
	if (mode === 'korea') {
		return {
			padding: THEME_MAP_KOREA_BOUNDS_PADDING,
			southOffsetDeg: 0
		}
	}

	return {
		padding: THEME_MAP_MAINLAND_BOUNDS_PADDING,
		southOffsetDeg: THEME_MAP_SOUTH_FOCUS_OFFSET_DEG
	}
}

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

/** setBounds로 맞춘 뒤 줌은 유지하고 중심만 남쪽으로 옮깁니다. */
function setBoundsThenShiftSouth(
	kakaoMaps: typeof kakao.maps,
	map: kakao.maps.Map,
	bounds: kakao.maps.LatLngBounds,
	padding: ThemeMapBoundsPadding,
	southOffsetDeg: number
) {
	const { top, right, bottom, left } = padding
	map.setBounds(bounds, top, right, bottom, left)

	if (southOffsetDeg <= 0) {
		return
	}

	const center = map.getCenter()
	map.setCenter(new kakaoMaps.LatLng(center.getLat() - southOffsetDeg, center.getLng()))
}

export {
	createPlacesLatLngBounds,
	DEFAULT_MARKER_Z_INDEX,
	getThemeMapBoundsView,
	getThemeMapMarkerZIndex,
	setBoundsThenShiftSouth,
	THEME_MAP_KOREA_BOUNDS_PADDING,
	THEME_MAP_MAINLAND_BOUNDS_PADDING,
	THEME_MAP_SOUTH_FOCUS_OFFSET_DEG
}
export type { ThemeMapBoundsMode, ThemeMapBoundsPadding, ThemeMapBoundsView, ThemeMapPlace }
