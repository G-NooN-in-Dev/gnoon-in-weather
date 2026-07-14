import { REALTIME_REVALIDATE_SECONDS } from '@/lib/weather/constants'
import type { WeatherSummary } from '@/types/weather-api.type'

/**
 * realtime 데이터가 캐시 TTL을 넘겼는지 판단합니다.
 * WeatherAPI `last_updated_epoch` 기준으로 비교합니다.
 */
function isRealtimeStale(weather: WeatherSummary, maxAgeSeconds: number = REALTIME_REVALIDATE_SECONDS): boolean {
	const { last_updated_epoch: lastUpdatedEpoch } = weather.realtime.current
	const nowSeconds = Math.floor(Date.now() / 1000)

	return nowSeconds - lastUpdatedEpoch > maxAgeSeconds
}

export { isRealtimeStale }
