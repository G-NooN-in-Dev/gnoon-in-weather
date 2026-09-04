'use client'

import { useMemo } from 'react'

import LoadingComponent from '@/components/loading-component'
import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import useAirportWeather from '@/features/theme-maps/hooks/use-airport-weather'
import { AirportCurrentWeatherSection, AirportPickerSection } from '@/features/theme-maps/sections'
import type { AirportDetailClientProps } from '@/features/theme-maps/types/airport-detail-component.type'
import { AstroScheduleSection, DailyWeatherSection, HourlyWeatherSection } from '@/features/weather/sections'
import { splitForecast } from '@/lib/weather/split-forecast'

/**
 * 공항 상세 client 조합기.
 * 서버 SSR 데이터로 첫 페인트 후, stale이면 홈과 같은 규칙으로 refetch합니다.
 * 좌표는 공항 고정이며 검색·GPS·레이더·자외선은 두지 않습니다.
 */
function AirportDetailClient({ airport, initialWeather, initialUnits, initialError }: AirportDetailClientProps) {
	const { weather, loading, error } = useAirportWeather({
		airport,
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
					<AirportCurrentWeatherSection airport={airport} current={current} error={activeError} />
					<HourlyWeatherSection hours={forecastSplit?.hours ?? []} astros={forecastSplit?.astros ?? []} />
					<DailyWeatherSection days={forecastSplit?.days ?? []} />
				</div>
				<aside className="flex flex-col gap-6 lg:w-1/3">
					<AirportPickerSection selectedIata={airport.iata} />
					<AstroScheduleSection astros={forecastSplit?.astros ?? []} coordinates={airport} />
				</aside>
			</div>
		</WeatherUnitsProvider>
	)
}

export default AirportDetailClient
