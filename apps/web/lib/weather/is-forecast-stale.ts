import type { WeatherSummary } from '@/types/weather-api.type'

/**
 * forecast 첫날이 realtime 기준 '오늘'과 다르면 stale로 봅니다.
 * Data Cache가 날짜가 바뀐 뒤에도 이전 날짜 예보를 줄 때 감지합니다.
 *
 * `last_updated`는 해당 지역 로컬 시각(예: "2026-07-21 15:15")입니다.
 */
function isForecastStale(weather: WeatherSummary): boolean {
	const firstDate = weather.forecast.forecast.forecastday[0]?.date

	if (!firstDate) {
		return true
	}

	const today = weather.realtime.current.last_updated.slice(0, 10)

	return firstDate !== today
}

export { isForecastStale }
