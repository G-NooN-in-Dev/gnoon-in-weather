'use client'

import {
	createAirportMarkerContent,
	setAirportMarkerSelected
} from '@/features/theme-maps/components/airport-marker-content'
import ThemePlacesKakaoMap from '@/features/theme-maps/components/theme-places-kakao-map'
import { type Airport, AIRPORTS, setOnlyInternationalMode } from '@/features/theme-maps/lib/airports'
import { getThemeMapBoundsView, type ThemeMapBoundsMode } from '@/features/theme-maps/lib/theme-map-place'

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type AirportSelectHandler = (iata: string) => void
/* eslint-enable no-unused-vars */

type AirportMapPlace = Airport & { id: string }

type AirportsKakaoMapProps = {
	selectedIata: string | null
	onSelect: AirportSelectHandler
	onClear?: () => void
	/**
	 * mainland: 제주를 제외한 내륙 뷰(서울~부산)
	 * korea: 제주 포함
	 */
	boundsMode?: ThemeMapBoundsMode
	/** true면 국제선 운영하는 공항만. bounds는 바꾸지 않고 마커만 보이거나 숨깁니다. */
	internationalOnly?: boolean
	className?: string
	mapClassName?: string
}

function toAirportMapPlace(airport: Airport): AirportMapPlace {
	return { ...airport, id: airport.iata }
}

const AIRPORT_MAP_PLACES = AIRPORTS.map(toAirportMapPlace)

/** 내륙 뷰(서울~부산)로 설정합니다. 제주 마커는 그대로 둡니다. */
const MAINLAND_AIRPORT_MAP_PLACES = AIRPORT_MAP_PLACES.filter((airport) => airport.iata !== 'CJU')

function getBoundsAirports(boundsMode: ThemeMapBoundsMode): AirportMapPlace[] {
	return boundsMode === 'korea' ? AIRPORT_MAP_PLACES : MAINLAND_AIRPORT_MAP_PLACES
}

/**
 * 카카오맵 + 공항 Plane CustomOverlay 마커.
 * 초기 뷰는 boundsMode로 정하고, internationalOnly 변경 시에는 줌을 유지합니다.
 */
function AirportsKakaoMap({
	selectedIata,
	onSelect,
	onClear,
	boundsMode = 'mainland',
	internationalOnly = false,
	className,
	mapClassName
}: AirportsKakaoMapProps) {
	const boundsView = getThemeMapBoundsView(boundsMode)

	return (
		<ThemePlacesKakaoMap
			places={AIRPORT_MAP_PLACES}
			boundsPlaces={getBoundsAirports(boundsMode)}
			boundsPadding={boundsView.padding}
			boundsKey={boundsMode}
			southOffsetDeg={boundsView.southOffsetDeg}
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
