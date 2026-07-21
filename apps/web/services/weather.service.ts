import { FORECAST_REVALIDATE_SECONDS, REALTIME_REVALIDATE_SECONDS } from '@/lib/weather/constants'
import { normalizeWeatherApiError, type WeatherApiErrorPayload } from '@/lib/weather/normalize-error'
import type {
	WeatherApiAstronomyResponse,
	WeatherApiForecastResponse,
	WeatherApiRealtimeResponse,
	WeatherFetchParams
} from '@/types/weather-api.type'

/** WeatherAPI fetch 시 Data Cache 사용 여부를 제어합니다. */
type WeatherFetchOptions = {
	/** true면 revalidate 캐시를 우회하고 WeatherAPI를 직접 조회합니다. */
	fresh?: boolean
}

/**
 * WeatherAPI 공통 요청 URL을 조립합니다.
 * 베이스 URL은 `.env`의 `WEATHER_API_BASE_URL`을 사용합니다.
 */
function buildWeatherApiUrl(pathname: string, params: WeatherFetchParams): URL {
	const baseUrl = process.env.WEATHER_API_BASE_URL
	const apiKey = process.env.WEATHER_API_KEY

	if (!baseUrl || !apiKey) {
		throw new Error('WeatherAPI 환경 변수가 설정되지 않았습니다.')
	}

	const url = new URL(`${baseUrl}/${pathname}`)

	url.searchParams.set('key', apiKey)
	url.searchParams.set('q', `${params.lat},${params.lng}`)
	url.searchParams.set('lang', params.lang ?? 'ko')

	return url
}

/** WeatherAPI 응답 실패 시 weather-error 규칙으로 변환해 throw합니다. */
async function parseWeatherApiResponse<T>(res: Response): Promise<T> {
	const payload = (await res.json()) as WeatherApiErrorPayload

	if (!res.ok || payload.error) {
		throw normalizeWeatherApiError(payload)
	}

	return payload as T
}

/**
 * WeatherAPI를 fetch합니다.
 * fresh가 아니면 Next.js Data Cache(revalidate)를 사용하고, fresh이면 항상 원본 API를 조회합니다.
 */
async function fetchWeatherApi<T>(url: URL, revalidateSeconds: number, options?: WeatherFetchOptions): Promise<T> {
	const res = await fetch(url, options?.fresh ? { cache: 'no-store' } : { next: { revalidate: revalidateSeconds } })

	return parseWeatherApiResponse<T>(res)
}

/** 현재 날씨를 조회합니다. */
async function getRealtimeWeather(
	params: WeatherFetchParams,
	options?: WeatherFetchOptions
): Promise<WeatherApiRealtimeResponse> {
	const url = buildWeatherApiUrl('current.json', params)

	return fetchWeatherApi<WeatherApiRealtimeResponse>(url, REALTIME_REVALIDATE_SECONDS, options)
}

/**
 * 3일 예보를 조회합니다.
 * fresh면 Data Cache를 우회합니다 (날짜가 바뀐 stale forecast 보정용).
 */
async function getForecastWeather(
	params: WeatherFetchParams,
	options?: WeatherFetchOptions
): Promise<WeatherApiForecastResponse> {
	const url = buildWeatherApiUrl('forecast.json', params)
	url.searchParams.set('days', String(params.days ?? 3))

	return fetchWeatherApi<WeatherApiForecastResponse>(url, FORECAST_REVALIDATE_SECONDS, options)
}

/**
 * 특정 날짜의 천체 정보(월출/월몰 포함)를 조회합니다.
 * 자정 경계 월출 status 계산을 위해 어제 1일 데이터를 보강할 때 사용합니다.
 */
async function getAstronomyWeather(
	params: WeatherFetchParams,
	date: string,
	options?: WeatherFetchOptions
): Promise<WeatherApiAstronomyResponse> {
	const url = buildWeatherApiUrl('astronomy.json', params)
	url.searchParams.set('dt', date)

	return fetchWeatherApi<WeatherApiAstronomyResponse>(url, FORECAST_REVALIDATE_SECONDS, options)
}

export { getAstronomyWeather, getForecastWeather, getRealtimeWeather, type WeatherFetchOptions }
