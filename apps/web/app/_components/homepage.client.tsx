'use client'

import { useMemo } from 'react'

import Loading from '@/components/loading'
import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import { CurrentWeatherSection, WeatherRadarSection } from '@/features/home/sections'
import type { HomepageClientProps } from '@/features/home/types/home-component.type'
import {
	DailyWeatherSection,
	HourlyWeatherSection,
	MoonriseMoonsetSection,
	SunriseSunsetSection,
	UvIndexSection
} from '@/features/weather/sections'
import { useWeather } from '@/hooks/use-weather'
import { splitForecast } from '@/utils/split-forecast-days'

/**
 * 홈 페이지 client 조합기.
 * 서버 SSR 데이터로 첫 페인트 후, 마운트 직후 클라이언트 refetch·GPS·좌표 변경을 처리합니다.
 */
function HomepageClient({ initialLocation, initialWeather, initialUnits, initialError }: HomepageClientProps) {
	const { location, weather, loading, isLocating, error, requestCurrentPosition } = useWeather({
		initialLocation,
		initialWeather,
		initialError
	})

	const activeWeather = weather ?? initialWeather
	const forecastSplit = useMemo(() => (activeWeather ? splitForecast(activeWeather.forecast) : null), [activeWeather])

	const current = activeWeather?.realtime.current ?? null
	const activeError = error ?? initialError
	const isPageLoading = loading

	return (
		<WeatherUnitsProvider initialUnits={initialUnits}>
			{isPageLoading ? <Loading /> : null}
			<div className="flex gap-10">
				<div className="flex w-2/3 flex-col gap-6">
					<CurrentWeatherSection
						current={current}
						location={location}
						loading={loading}
						isLocating={isLocating}
						error={activeError}
						onRequestCurrentPosition={requestCurrentPosition}
					/>
					<HourlyWeatherSection hours={forecastSplit?.hours ?? []} />
					<DailyWeatherSection days={forecastSplit?.days ?? []} />
				</div>
				<div className="flex w-1/3 flex-col gap-6">
					<section>검색</section>
					<UvIndexSection current={current} />
					<SunriseSunsetSection astros={forecastSplit?.astros ?? []} />
					<MoonriseMoonsetSection astros={forecastSplit?.astros ?? []} />
					<WeatherRadarSection />
				</div>
			</div>
		</WeatherUnitsProvider>
	)
}

export default HomepageClient
