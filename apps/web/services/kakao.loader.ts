import {
	formatCoordAddressLabel,
	mapAddressDocumentToSearchItem,
	mapKeywordDocumentToSearchItem,
	mergeLocationSearchItems
} from '@/lib/kakao/map-search-item'
import { getAddressPlaces, getCoordAddress, getKeywordPlaces } from '@/services/kakao.service'
import type { CoordAddressLabelResponse, LocationSearchItem } from '@/types/kakao-local.type'
import type { Coordinates } from '@/types/location.type'

/**
 * 키워드·주소 검색을 묶어 화면용 목록으로 반환합니다.
 * 장소명 결과를 앞에, 주소 결과는 뒤에 두고 동일 좌표는 제거합니다.
 */
async function loadLocationSearchResults(query: string): Promise<LocationSearchItem[]> {
	const [keywordResponse, addressResponse] = await Promise.all([getKeywordPlaces(query), getAddressPlaces(query)])

	const keywordItems = keywordResponse.documents
		.map(mapKeywordDocumentToSearchItem)
		.filter((item): item is LocationSearchItem => item !== null)

	const addressItems = addressResponse.documents
		.map(mapAddressDocumentToSearchItem)
		.filter((item): item is LocationSearchItem => item !== null)

	return mergeLocationSearchItems(keywordItems, addressItems)
}

/**
 * GPS 등으로 얻은 좌표를 CurrentLocation용 한글 라벨로 변환합니다.
 * 변환 결과가 없으면 빈 문자열을 반환합니다.
 */
async function loadCoordAddressLabel(coordinates: Coordinates): Promise<CoordAddressLabelResponse> {
	const response = await getCoordAddress(coordinates)
	const document = response.documents[0]
	const label = document ? formatCoordAddressLabel(document) : ''

	return {
		label,
		...coordinates
	}
}

export { loadCoordAddressLabel, loadLocationSearchResults }
