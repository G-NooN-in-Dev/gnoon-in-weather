/**
 * 클라이언트에서 호출하는 내부 카카오 API baseUrl입니다.
 * 라우트 경로가 바뀌면 이 파일만 수정합니다.
 */
const KAKAO_API_BASE_URL = '/api/kakao'

function buildKakaoApiUrl(pathname: string, query?: Record<string, string | number | boolean | null | undefined>) {
	const normalizedPath = pathname ? `/${pathname.replace(/^\/+/, '')}` : ''
	const url = new URL(`${KAKAO_API_BASE_URL}${normalizedPath}`, 'http://localhost')

	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value === null || value === undefined) {
				continue
			}

			url.searchParams.set(key, String(value))
		}
	}

	return `${url.pathname}${url.search}`
}

export { buildKakaoApiUrl, KAKAO_API_BASE_URL }
