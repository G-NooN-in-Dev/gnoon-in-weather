'use client'

import {
	createBaseballMarkerContent,
	setBaseballMarkerSelected
} from '@/features/theme-maps/components/baseball-marker-content'
import ThemePlacesKakaoMap from '@/features/theme-maps/components/theme-places-kakao-map'
import {
	BASEBALL_PARKS,
	type BaseballPark,
	type BaseballParkMapFilter,
	hasFirstTeamParkLevel,
	isBaseballParkVisibleForFilter
} from '@/features/theme-maps/lib/baseball-parks'
import { getThemeMapBoundsView } from '@/features/theme-maps/lib/theme-map-place'

/** 1군 홈구장 마커. 줌 아웃에서 2군보다 위에 둡니다. */
const FIRST_TEAM_PARK_MARKER_Z_INDEX = 2

function toBaseballMapPlace(park: BaseballPark) {
	return {
		...park,
		markerZIndex: hasFirstTeamParkLevel(park) ? FIRST_TEAM_PARK_MARKER_Z_INDEX : undefined
	}
}

const BASEBALL_MAP_PLACES = BASEBALL_PARKS.map(toBaseballMapPlace)

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type BaseballParkSelectHandler = (id: string) => void
/* eslint-enable no-unused-vars */

type BaseballKakaoMapProps = {
	selectedParkId: string | null
	onSelect: BaseballParkSelectHandler
	onClear?: () => void
	/** 선택한 군의 홈 구장만 보여 줍니다. */
	filter?: BaseballParkMapFilter
	className?: string
	mapClassName?: string
}

/**
 * 카카오맵 + 야구장 마커.
 */
function BaseballKakaoMap({
	selectedParkId,
	onSelect,
	onClear,
	filter = 'first',
	className,
	mapClassName
}: BaseballKakaoMapProps) {
	const boundsView = getThemeMapBoundsView('mainland')

	return (
		<ThemePlacesKakaoMap
			places={BASEBALL_MAP_PLACES}
			boundsPlaces={BASEBALL_MAP_PLACES}
			boundsPadding={boundsView.padding}
			boundsKey="mainland"
			southOffsetDeg={boundsView.southOffsetDeg}
			selectedId={selectedParkId}
			onSelect={onSelect}
			onClear={onClear}
			isPlaceVisible={(place) => isBaseballParkVisibleForFilter(place, filter)}
			visibilityKey={filter}
			createMarkerContent={createBaseballMarkerContent}
			setMarkerSelected={setBaseballMarkerSelected}
			className={className}
			mapClassName={mapClassName}
		/>
	)
}

export default BaseballKakaoMap
