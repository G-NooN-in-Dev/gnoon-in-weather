'use client'

import { useMemo } from 'react'

import Loading from '@/components/loading'
import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import useAirportWeather from '@/features/theme-maps/hooks/use-airport-weather'
import AirportCurrentWeatherSection from '@/features/theme-maps/sections/airport-current-weather.section'
import AirportPickerSection from '@/features/theme-maps/sections/airport-picker.section'
import type { AirportDetailClientProps } from '@/features/theme-maps/types/airport-detail-component.type'
import { AstroScheduleSections, DailyWeatherSection, HourlyWeatherSection } from '@/features/weather/sections'
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
			{loading ? <Loading /> : null}
			<div className="flex gap-10">
				<div className="flex w-2/3 flex-col gap-6">
					<AirportCurrentWeatherSection airport={airport} current={current} error={activeError} />
					<HourlyWeatherSection hours={forecastSplit?.hours ?? []} astros={forecastSplit?.astros ?? []} />
					<DailyWeatherSection days={forecastSplit?.days ?? []} />
				</div>
				<div className="flex w-1/3 flex-col gap-6">
					<AirportPickerSection />
					<AstroScheduleSections astros={forecastSplit?.astros ?? []} coordinates={airport} />
				</div>
			</div>
		</WeatherUnitsProvider>
	)
}

export default AirportDetailClient
