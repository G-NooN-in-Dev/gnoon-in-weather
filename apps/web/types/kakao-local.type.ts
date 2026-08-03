/**
 * 카카오 Local REST API 응답·앱 검색 결과 타입.
 * @see https://developers.kakao.com/docs/latest/ko/local/dev-guide
 */

/** 키워드 장소 검색 문서 (x=경도, y=위도 — 문자열) */
type KakaoKeywordDocument = {
	id: string
	place_name: string
	category_name: string
	category_group_code: string
	category_group_name: string
	phone: string
	address_name: string
	road_address_name: string
	x: string
	y: string
	place_url: string
	distance: string
}

type KakaoKeywordSearchResponse = {
	meta: {
		total_count: number
		pageable_count: number
		is_end: boolean
	}
	documents: KakaoKeywordDocument[]
}

/** 주소 검색 문서 */
type KakaoAddressDocument = {
	address_name: string
	y: string
	x: string
	address_type: string
	address: {
		address_name: string
		region_1depth_name: string
		region_2depth_name: string
		region_3depth_name: string
		main_address_no: string
		sub_address_no: string
	} | null
	road_address: {
		address_name: string
		region_1depth_name: string
		region_2depth_name: string
		region_3depth_name: string
		road_name: string
		building_name: string
	} | null
}

type KakaoAddressSearchResponse = {
	meta: {
		total_count: number
		pageable_count: number
		is_end: boolean
	}
	documents: KakaoAddressDocument[]
}

/** 좌표 → 주소 변환 문서 */
type KakaoCoord2AddressDocument = {
	address: {
		address_name: string
		region_1depth_name: string
		region_2depth_name: string
		region_3depth_name: string
	} | null
	road_address: {
		address_name: string
		region_1depth_name: string
		region_2depth_name: string
		region_3depth_name: string
		road_name: string
		building_name: string
	} | null
}

type KakaoCoord2AddressResponse = {
	meta: {
		total_count: number
	}
	documents: KakaoCoord2AddressDocument[]
}

/**
 * 검색창·훅에서 쓰는 정규화 결과.
 * label은 CurrentLocation / 쿠키에 그대로 들어갑니다.
 */
type LocationSearchItem = {
	id: string
	/** 화면·쿠키용 표시명 (장소명 또는 도로명/지번) */
	label: string
	/** 목록 보조 설명 (도로명·지번 등) */
	address: string
	lat: number
	lng: number
}

/** `/api/kakao/search` 성공 응답 */
type LocationSearchResponse = {
	items: LocationSearchItem[]
}

/** `/api/kakao/coord2address` 성공 응답 */
type CoordAddressLabelResponse = {
	label: string
	lat: number
	lng: number
}

export type {
	CoordAddressLabelResponse,
	KakaoAddressDocument,
	KakaoAddressSearchResponse,
	KakaoCoord2AddressDocument,
	KakaoCoord2AddressResponse,
	KakaoKeywordDocument,
	KakaoKeywordSearchResponse,
	LocationSearchItem,
	LocationSearchResponse
}
