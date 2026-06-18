import { getForecastWeather, getRealtimeWeather, type WeatherFetchOptions } from '@/services/weather.service'
import type { WeatherApiRealtimeResponse, WeatherFetchParams, WeatherSummary } from '@/types/weather-api.type'

const HOME_FORECAST_DAYS = 3
const HOME_WEATHER_LANG = 'ko'

/**
 * 서버·클라이언트 공통으로 좌표 기준 날씨 요약을 조회합니다.
 * SSR·좌표 변경 시 사용하며, realtime·forecast 모두 Data Cache를 적용합니다.
 */
async function loadWeatherSummary({
	lat,
	lng,
	lang = HOME_WEATHER_LANG,
	days = HOME_FORECAST_DAYS
}: WeatherFetchParams): Promise<WeatherSummary> {
	const [realtime, forecast] = await Promise.all([
		getRealtimeWeather({ lat, lng, lang }),
		getForecastWeather({ lat, lng, lang, days })
	])

	return { realtime, forecast }
}

/** realtime(current)만 조회합니다. stale 보강 시 fresh 옵션으로 캐시를 우회할 수 있습니다. */
async function loadRealtimeWeather(
	{ lat, lng, lang = HOME_WEATHER_LANG }: WeatherFetchParams,
	options?: WeatherFetchOptions
): Promise<WeatherApiRealtimeResponse> {
	return getRealtimeWeather({ lat, lng, lang }, options)
}

export { HOME_FORECAST_DAYS, HOME_WEATHER_LANG, loadRealtimeWeather, loadWeatherSummary }
