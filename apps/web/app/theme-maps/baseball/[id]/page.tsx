import { notFound } from 'next/navigation'

import BaseballDetailClient from '@/app/theme-maps/baseball/[id]/_components/baseball-detail.client'
import {
	getBaseballParkById,
	parseBaseballParkMapFilter,
	resolveBaseballParkMapFilter
} from '@/features/theme-maps/lib/baseball-parks'
import { isAppApiError } from '@/lib/api-error'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'
import { loadWeatherSummary } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'

type ThemeMapsBaseballDetailPageProps = {
	params: Promise<{ id: string }>
	searchParams: Promise<{ level?: string | string[] }>
}

async function ThemeMapsBaseballDetailPage({ params, searchParams }: ThemeMapsBaseballDetailPageProps) {
	const { id } = await params
	const { level } = await searchParams
	const park = getBaseballParkById(id)

	if (!park) {
		notFound()
	}

	const initialFilter = resolveBaseballParkMapFilter(park, parseBaseballParkMapFilter(level))
	const initialUnits = await readWeatherUnitsFromCookies()
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
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<BaseballDetailClient
				key={`${park.id}:${initialFilter}`}
				park={park}
				initialFilter={initialFilter}
				initialWeather={initialWeather}
				initialUnits={initialUnits}
				initialError={initialError}
			/>
		</div>
	)
}

export default ThemeMapsBaseballDetailPage
