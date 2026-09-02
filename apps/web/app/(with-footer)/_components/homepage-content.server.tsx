import HomepageClient from '@/app/(with-footer)/_components/homepage.client'
import { isAppApiError } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth/session.server'
import { resolveHomeLocation } from '@/lib/location/resolve-home'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'
import { loadFavoriteLocationsCached } from '@/services/favorite-location.loader.cache.server'
import { loadWeatherSummaryCached } from '@/services/weather.loader.cache.server'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'

type WeatherLoadResult = {
	weather: WeatherSummary | null
	error: AppApiError | null
}

async function loadWeatherSummarySafe(
	location: Awaited<ReturnType<typeof resolveHomeLocation>>
): Promise<WeatherLoadResult> {
	try {
		const weather = await loadWeatherSummaryCached(location)

		return { weather, error: null }
	} catch (error) {
		if (isAppApiError(error)) {
			return { weather: null, error }
		}

		return {
			weather: null,
			error: {
				provider: 'weatherapi',
				code: 0,
				key: 'WEATHER_INTERNAL_ERROR',
				status: 500,
				retryable: true,
				message: error instanceof Error ? error.message : '날씨 정보를 불러오는 중 오류가 발생했습니다.'
			}
		}
	}
}

async function HomepageContentServer() {
	const [user, baseLocation, initialUnits] = await Promise.all([
		getCurrentUser(),
		resolveHomeLocation(),
		readWeatherUnitsFromCookies()
	])

	const [initialFavoriteLocations, { weather: initialWeather, error: initialError }] = await Promise.all([
		user ? loadFavoriteLocationsCached(user.id) : Promise.resolve([]),
		loadWeatherSummarySafe(baseLocation)
	])

	return (
		<HomepageClient
			initialLocation={baseLocation}
			initialWeather={initialWeather}
			initialUnits={initialUnits}
			initialError={initialError}
			initialFavoriteLocations={initialFavoriteLocations}
			isLoggedIn={user !== null}
		/>
	)
}

export default HomepageContentServer
