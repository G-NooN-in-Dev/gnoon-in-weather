type Coordinates = {
	lat: number
	lng: number
}

/** 메인 페이지에서 사용하는 위치 상태 (최근 조회 좌표 + 표시 라벨) */
type LocationState = Coordinates & {
	label: string
	/** 카카오 장소 id — 검색·GPS 역지오코딩만으로 온 경우 없음 */
	placeId?: string | null
	/** 목록 보조 설명 (도로명·지번 등) */
	address?: string
}

export type { Coordinates, LocationState }
