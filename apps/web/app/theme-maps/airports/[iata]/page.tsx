import { notFound } from 'next/navigation'

import AirportDetailClient from '@/app/theme-maps/airports/[iata]/_components/airport-detail.client'
import { getAirportByIata } from '@/features/theme-maps/lib/airports'
import { isAppApiError } from '@/lib/api-error'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'

type ThemeMapsAirportDetailPageProps = {
	params: Promise<{ iata: string }>
}

async function ThemeMapsAirportDetailPage({ params }: ThemeMapsAirportDetailPageProps) {
	const { iata } = await params
	const airport = getAirportByIata(iata)

	if (!airport) {
		notFound()
	}

	const initialUnits = await readWeatherUnitsFromCookies()
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
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<AirportDetailClient
				key={airport.iata}
				airport={airport}
				initialWeather={initialWeather}
				initialUnits={initialUnits}
				initialError={initialError}
			/>
		</div>
	)
}

export default ThemeMapsAirportDetailPage
