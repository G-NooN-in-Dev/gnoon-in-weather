type Coordinates = {
	lat: number
	lng: number
}

/** 메인 페이지에서 사용하는 위치 상태 (최근 조회 좌표 + 표시 라벨) */
type LocationState = Coordinates & {
	label: string
}

export type { Coordinates, LocationState }
