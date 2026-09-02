import AirportDetailClient from '@/app/theme-maps/airports/[iata]/_components/airport-detail.client'
import type { Airport } from '@/features/theme-maps/lib/airports'
import { isAppApiError } from '@/lib/api-error'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

type AirportDetailContentServerProps = {
	airport: Airport
	initialUnits: WeatherUnits | null
}

async function AirportDetailContentServer({ airport, initialUnits }: AirportDetailContentServerProps) {
	let initialWeather: WeatherSummary | null = null
	let initialError: AppApiError | null = null

	try {
		initialWeather = await loadWeatherSummary(airport)
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
		<AirportDetailClient
			key={airport.iata}
			airport={airport}
			initialWeather={initialWeather}
			initialUnits={initialUnits}
			initialError={initialError}
		/>
	)
}

export default AirportDetailContentServer
