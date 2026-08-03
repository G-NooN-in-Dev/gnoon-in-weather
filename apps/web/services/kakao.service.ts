import { KAKAO_SEARCH_SIZE } from '@/lib/kakao/constants'
import { type KakaoErrorPayload, normalizeKakaoApiError } from '@/lib/kakao/normalize-error'
import type {
	KakaoAddressSearchResponse,
	KakaoCoord2AddressResponse,
	KakaoKeywordSearchResponse
} from '@/types/kakao-local.type'
import type { Coordinates } from '@/types/location.type'

/**
 * 카카오 Local REST 공통 URL을 조립합니다.
 * `KAKAO_LOCAL_API_BASE_URL`은 보통 `https://dapi.kakao.com/v2/local` 형태입니다.
 * 키·베이스 URL은 service에서만 읽고 loader/UI로 노출하지 않습니다.
 */
function buildKakaoLocalApiUrl(pathname: string, searchParams: Record<string, string>): URL {
	const baseUrl = process.env.KAKAO_LOCAL_API_BASE_URL
	const apiKey = process.env.KAKAO_REST_API_KEY

	if (!baseUrl || !apiKey) {
		throw new Error('카카오 Local API 환경 변수가 설정되지 않았습니다.')
	}

	const url = new URL(`${baseUrl.replace(/\/$/, '')}/${pathname.replace(/^\//, '')}`)

	for (const [key, value] of Object.entries(searchParams)) {
		url.searchParams.set(key, value)
	}

	return url
}

function getKakaoRestApiKey(): string {
	const apiKey = process.env.KAKAO_REST_API_KEY

	if (!apiKey) {
		throw new Error('KAKAO_REST_API_KEY가 설정되지 않았습니다.')
	}

	return apiKey
}

/** 카카오 Local 응답 실패 시 공통 에러로 변환해 throw합니다. */
async function parseKakaoLocalResponse<T>(res: Response): Promise<T> {
	const payload = (await res.json()) as T & KakaoErrorPayload

	if (!res.ok) {
		throw normalizeKakaoApiError(payload)
	}

	return payload
}

async function fetchKakaoLocalApi<T>(url: URL): Promise<T> {
	const res = await fetch(url, {
		headers: {
			Authorization: `KakaoAK ${getKakaoRestApiKey()}`
		},
		// 검색·역지오코딩은 사용자 입력 의존이라 캐시하지 않습니다.
		cache: 'no-store'
	})

	return parseKakaoLocalResponse<T>(res)
}

/** 키워드로 장소를 검색합니다. */
async function getKeywordPlaces(query: string): Promise<KakaoKeywordSearchResponse> {
	const url = buildKakaoLocalApiUrl('search/keyword.json', {
		query,
		size: String(KAKAO_SEARCH_SIZE)
	})

	return fetchKakaoLocalApi<KakaoKeywordSearchResponse>(url)
}

/** 주소(도로명·지번)로 검색합니다. */
async function getAddressPlaces(query: string): Promise<KakaoAddressSearchResponse> {
	const url = buildKakaoLocalApiUrl('search/address.json', {
		query,
		size: String(KAKAO_SEARCH_SIZE)
	})

	return fetchKakaoLocalApi<KakaoAddressSearchResponse>(url)
}

/**
 * 좌표를 도로명/지번 주소로 변환합니다.
 * 카카오 API는 x=경도, y=위도 순서입니다.
 */
async function getCoordAddress({ lat, lng }: Coordinates): Promise<KakaoCoord2AddressResponse> {
	const url = buildKakaoLocalApiUrl('geo/coord2address.json', {
		x: String(lng),
		y: String(lat),
		input_coord: 'WGS84'
	})

	return fetchKakaoLocalApi<KakaoCoord2AddressResponse>(url)
}

export { getAddressPlaces, getCoordAddress, getKeywordPlaces }
