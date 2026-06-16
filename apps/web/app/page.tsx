import HomepageClient from '@/app/_components/homepage.client'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { LocationState } from '@/types/location.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import { isAppApiError } from '@/utils/api-error'
import { formatWeatherLocationLabel } from '@/utils/format-weather-location'
import { resolveHomeLocation } from '@/utils/resolve-home-location'

async function Homepage() {
	const baseLocation = await resolveHomeLocation()
	let initialLocation: LocationState = baseLocation
	let initialWeather: WeatherSummary | null = null
	let initialError: AppApiError | null = null

	try {
		initialWeather = await loadWeatherSummary(baseLocation)

		if (!baseLocation.label) {
			initialLocation = {
				...baseLocation,
				label: formatWeatherLocationLabel(initialWeather.realtime.location)
			}
		}
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
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<HomepageClient
						initialLocation={initialLocation}
						initialWeather={initialWeather}
						initialError={initialError}
					/>
				</div>
			</main>
		</div>
	)
}

export default Homepage
