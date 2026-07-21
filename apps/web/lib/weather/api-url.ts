/**
 * 클라이언트/서버에서 공통으로 사용하는 내부 weather API baseUrl입니다.
 * 라우트 경로가 바뀌어도 이 파일만 수정하면 모든 호출부가 함께 갱신됩니다.
 */
const WEATHER_API_BASE_URL = '/api/weather'

function buildWeatherApiUrl(pathname?: string, query?: Record<string, string | number | boolean | null | undefined>) {
	const normalizedPath = pathname ? `/${pathname.replace(/^\/+/, '')}` : ''
	const url = new URL(`${WEATHER_API_BASE_URL}${normalizedPath}`, 'http://localhost')

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

export { buildWeatherApiUrl, WEATHER_API_BASE_URL }
