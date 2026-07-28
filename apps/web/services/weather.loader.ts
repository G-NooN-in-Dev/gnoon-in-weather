import { isForecastStale } from '@/lib/weather/is-forecast-stale'
import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import { getForecastWeather, getRealtimeWeather, type WeatherFetchOptions } from '@/services/weather.service'
import type { WeatherApiRealtimeResponse, WeatherFetchParams, WeatherSummary } from '@/types/weather-api.type'

const HOME_FORECAST_DAYS = 3
const HOME_WEATHER_LANG = 'ko'

/**
 * 서버·클라이언트 공통으로 좌표 기준 날씨 요약을 조회합니다.
 * SSR·좌표 변경 시 사용하며, realtime·forecast 모두 Data Cache를 적용합니다.
 *
 * - `fresh`면 캐시를 우회해 둘 다 원본 API를 조회합니다.
 * - 아니면 캐시 조회 후, realtime TTL 초과·forecast 날짜 stale이면 해당 항목만 fresh로 보정합니다.
 */
async function loadWeatherSummary(
	{ lat, lng, lang = HOME_WEATHER_LANG, days = HOME_FORECAST_DAYS }: WeatherFetchParams,
	options?: WeatherFetchOptions
): Promise<WeatherSummary> {
	const fetchParams = { lat, lng, lang, days }

	if (options?.fresh) {
		const [realtime, forecast] = await Promise.all([
			getRealtimeWeather(fetchParams, { fresh: true }),
			getForecastWeather(fetchParams, { fresh: true })
		])

		return { realtime, forecast }
	}

	const [realtime, forecast] = await Promise.all([getRealtimeWeather(fetchParams), getForecastWeather(fetchParams)])
	let summary: WeatherSummary = { realtime, forecast }

	// realtime이 TTL을 넘겼으면 last_updated 날짜도 믿을 수 없으므로 먼저 보정합니다.
	if (isRealtimeStale(summary)) {
		summary = {
			...summary,
			realtime: await getRealtimeWeather(fetchParams, { fresh: true })
		}
	}

	// 보정된 realtime 기준으로 forecast 날짜가 어긋나면 forecast만 fresh로 다시 가져옵니다.
	if (isForecastStale(summary)) {
		summary = {
			...summary,
			forecast: await getForecastWeather(fetchParams, { fresh: true })
		}
	}

	return summary
}

/** realtime(current)만 조회합니다. stale 보강 시 fresh 옵션으로 캐시를 우회할 수 있습니다. */
async function loadRealtimeWeather(
	{ lat, lng, lang = HOME_WEATHER_LANG }: WeatherFetchParams,
	options?: WeatherFetchOptions
): Promise<WeatherApiRealtimeResponse> {
	return getRealtimeWeather({ lat, lng, lang }, options)
}

export { HOME_FORECAST_DAYS, HOME_WEATHER_LANG, loadRealtimeWeather, loadWeatherSummary }
