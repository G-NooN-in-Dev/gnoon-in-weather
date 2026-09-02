import HomepageClient from '@/app/_components/homepage.client'
import { isAppApiError } from '@/lib/api-error'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { FavoriteLocation } from '@/types/favorite-location.type'
import type { LocationState } from '@/types/location.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

type HomepageWeatherServerProps = {
	baseLocation: LocationState
	initialUnits: WeatherUnits | null
	initialFavoriteLocations: FavoriteLocation[]
	isLoggedIn: boolean
}

async function HomepageWeatherServer({
	baseLocation,
	initialUnits,
	initialFavoriteLocations,
	isLoggedIn
}: HomepageWeatherServerProps) {
	let initialWeather: WeatherSummary | null = null
	let initialError: AppApiError | null = null

	try {
		initialWeather = await loadWeatherSummary(baseLocation)
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
		<HomepageClient
			initialLocation={baseLocation}
			initialWeather={initialWeather}
			initialUnits={initialUnits}
			initialError={initialError}
			initialFavoriteLocations={initialFavoriteLocations}
			isLoggedIn={isLoggedIn}
		/>
	)
}

export default HomepageWeatherServer
