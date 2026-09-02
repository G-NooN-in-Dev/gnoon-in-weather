import BaseballDetailClient from '@/app/theme-maps/baseball/[id]/_components/baseball-detail.client'
import type { BaseballPark, BaseballParkMapFilter } from '@/features/theme-maps/lib/baseball-parks'
import { isAppApiError } from '@/lib/api-error'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

type BaseballDetailContentServerProps = {
	park: BaseballPark
	initialFilter: BaseballParkMapFilter
	initialUnits: WeatherUnits | null
}

async function BaseballDetailContentServer({ park, initialFilter, initialUnits }: BaseballDetailContentServerProps) {
	let initialWeather: WeatherSummary | null = null
	let initialError: AppApiError | null = null

	try {
		initialWeather = await loadWeatherSummary(park)
	} catch (error) {
		if (isAppApiError(error)) {
			initialError = error
		} else {
			initialError = {
				provider: 'weatherapi',
				code: 0,
				key: 'WEATHER_INTERNAL_ERROR',
				status: 500,
				retryable: true,
				message: error instanceof Error ? error.message : '날씨 정보를 불러오는 중 오류가 발생했습니다.'
			}
		}
	}

	return (
		<BaseballDetailClient
			key={`${park.id}:${initialFilter}`}
			park={park}
			initialFilter={initialFilter}
			initialWeather={initialWeather}
			initialUnits={initialUnits}
			initialError={initialError}
		/>
	)
}

export default BaseballDetailContentServer
