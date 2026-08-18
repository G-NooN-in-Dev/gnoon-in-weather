'use client'

import {
	createAirportMarkerContent,
	setAirportMarkerSelected
} from '@/features/theme-maps/components/airport-marker-content'
import ThemePlacesKakaoMap from '@/features/theme-maps/components/theme-places-kakao-map'
import { type Airport, AIRPORTS, getAirportByIata, setOnlyInternationalMode } from '@/features/theme-maps/lib/airports'
import {
	THEME_MAP_KOREA_BOUNDS_PADDING,
	THEME_MAP_METRO_BOUNDS_PADDING
} from '@/features/theme-maps/lib/theme-map-place'

type AirportBoundsMode = 'metro' | 'korea'
/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
/* eslint-enable no-unused-vars */

/** 목록 페이지 기본 포커스: 인천·김포·원주·청주·양양 일대 */
const METRO_FOCUS_IATAS = ['ICN', 'GMP', 'WJU', 'CJJ', 'YNY'] as const

type AirportMapPlace = Airport & { id: string }

type AirportsKakaoMapProps = {
	selectedIata: string | null
	onSelect: AirportSelectHandler
	onClear?: () => void
	/** metro: 수도권 focus, korea: 전체 공항이 한 화면에 들어오도록 고정 */
	boundsMode?: AirportBoundsMode
	/** true면 국제공항만. bounds는 바꾸지 않고 마커만 보이거나 숨깁니다. */
	internationalOnly?: boolean
	className?: string
	mapClassName?: string
}

function toAirportMapPlace(airport: Airport): AirportMapPlace {
	return { ...airport, id: airport.iata }
}

const AIRPORT_MAP_PLACES = AIRPORTS.map(toAirportMapPlace)

function getBoundsAirports(boundsMode: AirportBoundsMode): AirportMapPlace[] {
	if (boundsMode === 'korea') {
		return AIRPORT_MAP_PLACES
	}

	return METRO_FOCUS_IATAS.map((iata) => getAirportByIata(iata))
		.filter((airport): airport is Airport => airport !== undefined)
		.map(toAirportMapPlace)
}

/**
 * 카카오맵 + 공항 Plane CustomOverlay 마커.
 * boundsMode에 따라 초기 뷰만 정하고, internationalOnly 변경 시에는 줌을 유지합니다.
 */
function AirportsKakaoMap({
	selectedIata,
	onSelect,
	onClear,
	boundsMode = 'metro',
	internationalOnly = false,
	className,
	mapClassName
}: AirportsKakaoMapProps) {
	return (
		<ThemePlacesKakaoMap
			places={AIRPORT_MAP_PLACES}
			boundsPlaces={getBoundsAirports(boundsMode)}
			boundsPadding={boundsMode === 'korea' ? THEME_MAP_KOREA_BOUNDS_PADDING : THEME_MAP_METRO_BOUNDS_PADDING}
			boundsKey={boundsMode}
			selectedId={selectedIata}
			onSelect={onSelect}
			onClear={onClear}
			isPlaceVisible={(place) => setOnlyInternationalMode(place.kind, internationalOnly)}
			visibilityKey={internationalOnly}
			createMarkerContent={createAirportMarkerContent}
			setMarkerSelected={setAirportMarkerSelected}
			className={className}
			mapClassName={mapClassName}
		/>
	)
}

export default AirportsKakaoMap
