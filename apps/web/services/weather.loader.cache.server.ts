import { cacheLife, cacheTag } from 'next/cache'

import { REALTIME_REVALIDATE_SECONDS } from '@/lib/weather/constants'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { WeatherFetchParams, WeatherSummary } from '@/types/weather-api.type'

/**
 * SSR용 좌표별 날씨 요약 — Cache Components로 요청 간 공유합니다.
 * `/api/weather` 등 fresh가 필요한 경로는 `loadWeatherSummary`를 직접 사용합니다.
 */
async function loadWeatherSummaryCached(params: WeatherFetchParams): Promise<WeatherSummary> {
	'use cache'
	cacheTag('weather-summary')
	cacheLife({ revalidate: REALTIME_REVALIDATE_SECONDS })

	return loadWeatherSummary(params)
}

export { loadWeatherSummaryCached }
