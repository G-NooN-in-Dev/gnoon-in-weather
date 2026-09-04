'use client'

import { useCallback, useMemo } from 'react'

import LoadingComponent from '@/components/loading-component'
import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import LocationSearch from '@/features/home/components/location-search'
import { CurrentWeatherSection, WeatherRadarSection } from '@/features/home/sections'
import type { HomepageClientProps } from '@/features/home/types/home-component.type'
import {
	AstroScheduleSection,
	DailyWeatherSection,
	HourlyWeatherSection,
	UvIndexSection
} from '@/features/weather/sections'
import useFavoriteLocations from '@/hooks/use-favorite-locations'
import useWeather from '@/hooks/use-weather'
import { splitForecast } from '@/lib/weather/split-forecast'

/**
 * 홈 페이지 client 조합기.
 * 서버 SSR 데이터로 첫 페인트 후, 마운트 직후 클라이언트 refetch·GPS·검색·좌표 변경을 처리합니다.
 */
function HomepageClient({
	initialLocation,
	initialWeather,
	initialUnits,
	initialError,
	initialFavoriteLocations,
	isLoggedIn
}: HomepageClientProps) {
	const { location, weather, loading, isLocating, error, requestCurrentPosition, selectLocation } = useWeather({
		initialLocation,
		initialWeather,
		initialError
	})

	const {
		isFavorite,
		isPending: isFavoritePending,
		toggleFavorite
	} = useFavoriteLocations({
		initialItems: initialFavoriteLocations,
		isLoggedIn
	})

	const handleToggleFavorite = useCallback(() => {
		void toggleFavorite(location)
	}, [location, toggleFavorite])

	const activeWeather = weather ?? initialWeather
	const forecastSplit = useMemo(() => (activeWeather ? splitForecast(activeWeather.forecast) : null), [activeWeather])

	const current = activeWeather?.realtime.current ?? null
	const activeError = error ?? initialError
	const locationIsFavorite = isFavorite(location)

	return (
		<WeatherUnitsProvider initialUnits={initialUnits}>
			{loading ? <LoadingComponent /> : null}
			{/* 모바일 1열(검색 → 좌측 → aside), lg 이상 2열 */}
			<div className="flex flex-col gap-6 px-6 md:px-8 lg:flex-row lg:gap-10 lg:px-10">
				<div className="flex flex-col gap-6 lg:w-2/3">
					{/* 모바일: CurrentLocation보다 위에 검색 배치 */}
					<LocationSearch className="lg:hidden" onSelect={selectLocation} />
					<CurrentWeatherSection
						current={current}
						location={location}
						loading={loading}
						isLocating={isLocating}
						error={activeError}
						onRequestCurrentPosition={requestCurrentPosition}
						isFavorite={locationIsFavorite}
						isFavoritePending={isFavoritePending}
						onToggleFavorite={handleToggleFavorite}
					/>
					<HourlyWeatherSection hours={forecastSplit?.hours ?? []} astros={forecastSplit?.astros ?? []} />
					<DailyWeatherSection days={forecastSplit?.days ?? []} />
				</div>
				<aside className="flex flex-col gap-6 lg:w-1/3">
					{/* 데스크탑: aside 상단에 검색 유지 */}
					<LocationSearch className="hidden lg:block" onSelect={selectLocation} />
					<UvIndexSection current={current} />
					<AstroScheduleSection astros={forecastSplit?.astros ?? []} coordinates={location} />
					<WeatherRadarSection />
				</aside>
			</div>
		</WeatherUnitsProvider>
	)
}

export default HomepageClient
