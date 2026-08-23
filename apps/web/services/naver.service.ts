import { type NaverErrorPayload, normalizeNaverApiError } from '@/lib/naver/normalize-error'
import type { NaverNewsSearchParams, NaverNewsSearchResponse } from '@/types/naver-news.type'

/**
 * 네이버 검색 API 공통 URL을 조립합니다.
 * `NAVER_API_BASE_URL`은 보통 `https://openapi.naver.com/v1` 형태입니다.
 */
function buildNaverApiUrl(pathname: string, searchParams: Record<string, string>): URL {
	const baseUrl = process.env.NAVER_API_BASE_URL
	const clientId = process.env.NAVER_CLIENT_ID
	const clientSecret = process.env.NAVER_CLIENT_SECRET

	if (!baseUrl || !clientId || !clientSecret) {
		throw new Error('네이버 Open API 환경 변수가 설정되지 않았습니다.')
	}

	const url = new URL(`${baseUrl.replace(/\/$/, '')}/${pathname.replace(/^\//, '')}`)

	for (const [key, value] of Object.entries(searchParams)) {
		url.searchParams.set(key, value)
	}

	return url
}

function getNaverClientHeaders(): HeadersInit {
	const clientId = process.env.NAVER_CLIENT_ID
	const clientSecret = process.env.NAVER_CLIENT_SECRET

	if (!clientId || !clientSecret) {
		throw new Error('NAVER_CLIENT_ID / NAVER_CLIENT_SECRET이 설정되지 않았습니다.')
	}

	return {
		'X-Naver-Client-Id': clientId,
		'X-Naver-Client-Secret': clientSecret
	}
}

async function parseNaverApiResponse<T>(res: Response): Promise<T> {
	const payload = (await res.json()) as T & NaverErrorPayload

	if (!res.ok) {
		throw normalizeNaverApiError(payload, res.status)
	}

	return payload
}

async function fetchNaverApi<T>(url: URL): Promise<T> {
	const res = await fetch(url, {
		headers: getNaverClientHeaders(),
		// 뉴스 검색은 시점마다 결과가 달라지므로 캐시하지 않습니다.
		cache: 'no-store'
	})

	return parseNaverApiResponse<T>(res)
}

/** 네이버 뉴스 검색 결과를 조회합니다. */
async function getNewsSearch(params: NaverNewsSearchParams): Promise<NaverNewsSearchResponse> {
	const url = buildNaverApiUrl('search/news.json', {
		query: params.query,
		display: String(params.display ?? 10),
		start: String(params.start ?? 1),
		sort: params.sort ?? 'sim'
	})

	return fetchNaverApi<NaverNewsSearchResponse>(url)
}

export { getNewsSearch }
