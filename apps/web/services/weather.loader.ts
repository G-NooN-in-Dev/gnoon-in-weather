import { getForecastWeather, getRealtimeWeather } from '@/services/weather.service'
import type { WeatherFetchParams, WeatherSummary } from '@/types/weather-api.type'

const HOME_FORECAST_DAYS = 3
const HOME_WEATHER_LANG = 'ko'

/**
 * 서버·클라이언트 공통으로 좌표 기준 날씨 요약을 조회합니다.
 * Route Handler와 page.tsx 초기 로드에서 재사용합니다.
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

export { HOME_FORECAST_DAYS, HOME_WEATHER_LANG, loadWeatherSummary }
