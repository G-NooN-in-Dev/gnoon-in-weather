import HomepageClient from '@/app/_components/homepage.client'
import { isAppApiError } from '@/lib/api-error'
import { resolveHomeLocation } from '@/lib/location/resolve-home'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { LocationState } from '@/types/location.type'
import type { WeatherSummary } from '@/types/weather-api.type'

async function Homepage() {
	const baseLocation = await resolveHomeLocation()
	const initialUnits = await readWeatherUnitsFromCookies()
	// 라벨은 쿠키·기본값(카카오/수동)만 사용하고 WeatherAPI location으로 채우지 않습니다.
	const initialLocation: LocationState = baseLocation
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
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<HomepageClient
						initialLocation={initialLocation}
						initialWeather={initialWeather}
						initialUnits={initialUnits}
						initialError={initialError}
					/>
				</div>
			</main>
		</div>
	)
}

export default Homepage
