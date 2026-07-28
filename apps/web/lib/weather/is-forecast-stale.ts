import dayjs from 'dayjs'

import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import type { WeatherSummary } from '@/types/weather-api.type'

/**
 * forecast 날짜 비교에 쓸 "오늘"을 고릅니다.
 * - realtime이 신선하면 `last_updated`의 지역 로컬 날짜를 신뢰합니다.
 * - realtime이 오래됐으면 `last_updated`도 옛 날짜이므로 기기 달력을 씁니다.
 *   (둘 다 같은 날의 stale 캐시일 때 firstDate === last_updated 날짜로 오판하는 것을 막습니다.)
 */
function getForecastReferenceToday(weather: WeatherSummary): string {
	if (isRealtimeStale(weather)) {
		return dayjs().format('YYYY-MM-DD')
	}

	return weather.realtime.current.last_updated.slice(0, 10)
}

/**
 * forecast 첫날이 기준 "오늘"과 다르면 stale로 봅니다.
 * Data Cache가 날짜가 바뀐 뒤에도 이전 날짜 예보를 줄 때 감지합니다.
 */
function isForecastStale(weather: WeatherSummary): boolean {
	const firstDate = weather.forecast.forecast.forecastday[0]?.date

	if (!firstDate) {
		return true
	}

	return firstDate !== getForecastReferenceToday(weather)
}

export { getForecastReferenceToday, isForecastStale }
