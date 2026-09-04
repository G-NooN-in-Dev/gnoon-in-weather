'use client'

import { useMemo } from 'react'

import LoadingComponent from '@/components/loading-component'
import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import useBaseballWeather from '@/features/theme-maps/hooks/use-baseball-weather'
import { BaseballCurrentWeatherSection, BaseballPickerSection } from '@/features/theme-maps/sections'
import type { BaseballDetailClientProps } from '@/features/theme-maps/types/baseball-detail-component.type'
import {
	AstroScheduleSection,
	DailyWeatherSection,
	HourlyWeatherSection,
	UvIndexSection
} from '@/features/weather/sections'
import { splitForecast } from '@/lib/weather/split-forecast'

/**
 * 야구장 상세 client 조합기.
 * 서버 SSR 데이터로 첫 페인트 후, stale이면 홈과 같은 규칙으로 refetch합니다.
 * 좌표는 구장 고정이며 검색·GPS·레이더는 두지 않습니다.
 */
function BaseballDetailClient({
	park,
	initialFilter,
	initialWeather,
	initialUnits,
	initialError
}: BaseballDetailClientProps) {
	const { weather, loading, error } = useBaseballWeather({
		park,
		initialWeather,
		initialError
	})

	const activeWeather = weather ?? initialWeather
	const forecastSplit = useMemo(() => (activeWeather ? splitForecast(activeWeather.forecast) : null), [activeWeather])

	const current = activeWeather?.realtime.current ?? null
	const activeError = error ?? initialError

	return (
		<WeatherUnitsProvider initialUnits={initialUnits}>
			{loading ? <LoadingComponent /> : null}
			<div className="flex flex-col gap-6 px-6 md:px-8 lg:flex-row lg:gap-10 lg:px-10">
				<div className="flex flex-col gap-6 lg:w-2/3">
					<BaseballCurrentWeatherSection park={park} current={current} error={activeError} />
					<HourlyWeatherSection hours={forecastSplit?.hours ?? []} astros={forecastSplit?.astros ?? []} />
					<DailyWeatherSection days={forecastSplit?.days ?? []} />
				</div>
				<aside className="flex flex-col gap-6 lg:w-1/3">
					<BaseballPickerSection selectedParkId={park.id} initialFilter={initialFilter} />
					<UvIndexSection current={current} />
					<AstroScheduleSection astros={forecastSplit?.astros ?? []} coordinates={park} />
				</aside>
			</div>
		</WeatherUnitsProvider>
	)
}

export default BaseballDetailClient
