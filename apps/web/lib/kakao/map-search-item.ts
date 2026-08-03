import type {
	KakaoAddressDocument,
	KakaoCoord2AddressDocument,
	KakaoKeywordDocument,
	LocationSearchItem
} from '@/types/kakao-local.type'

/** 카카오 x(경도)·y(위도) 문자열을 숫자 좌표로 변환합니다. 실패 시 null. */
function parseKakaoLngLat(x: string, y: string): { lat: number; lng: number } | null {
	const lng = Number(x)
	const lat = Number(y)

	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return null
	}

	return { lat, lng }
}

/** 키워드 검색 문서를 앱 검색 항목으로 변환합니다. */
function mapKeywordDocumentToSearchItem(document: KakaoKeywordDocument): LocationSearchItem | null {
	const coordinates = parseKakaoLngLat(document.x, document.y)

	if (!coordinates) {
		return null
	}

	const address = document.road_address_name || document.address_name

	return {
		id: `keyword:${document.id}`,
		label: document.place_name,
		address,
		...coordinates
	}
}

/** 주소 검색 문서를 앱 검색 항목으로 변환합니다. (도로명 우선 라벨) */
function mapAddressDocumentToSearchItem(document: KakaoAddressDocument, index: number): LocationSearchItem | null {
	const coordinates = parseKakaoLngLat(document.x, document.y)

	if (!coordinates) {
		return null
	}

	const roadName = document.road_address?.address_name
	const label = roadName || document.address_name
	const address = roadName && document.address_name !== roadName ? document.address_name : ''

	return {
		id: `address:${document.x},${document.y}:${index}`,
		label,
		address,
		...coordinates
	}
}

/**
 * GPS·역지오코딩용 표시 라벨.
 * 도로명 주소 → 지번 주소 → 구/동 순으로 고릅니다.
 */
function formatCoordAddressLabel(document: KakaoCoord2AddressDocument): string {
	const { road_address: road, address } = document

	if (road?.address_name) {
		return road.address_name
	}

	if (address?.address_name) {
		return address.address_name
	}

	const regionLabel = [address?.region_2depth_name, address?.region_3depth_name].filter(Boolean).join(' ').trim()

	return regionLabel
}

/**
 * 키워드·주소 결과를 합치고, 같은 좌표는 한 번만 남깁니다.
 * 장소명(키워드)을 앞에 두어 목록에서 먼저 보이게 합니다.
 */
function mergeLocationSearchItems(
	keywordItems: LocationSearchItem[],
	addressItems: LocationSearchItem[]
): LocationSearchItem[] {
	const seen = new Set<string>()
	const merged: LocationSearchItem[] = []

	for (const item of [...keywordItems, ...addressItems]) {
		const key = `${item.lat.toFixed(5)},${item.lng.toFixed(5)}`

		if (seen.has(key)) {
			continue
		}

		seen.add(key)
		merged.push(item)
	}

	return merged
}

export {
	formatCoordAddressLabel,
	mapAddressDocumentToSearchItem,
	mapKeywordDocumentToSearchItem,
	mergeLocationSearchItems,
	parseKakaoLngLat
}
