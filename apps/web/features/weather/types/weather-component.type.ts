import type { Coordinates } from '@/types/location.type'
import type { ForecastAstroEntry, ForecastDayEntry, WeatherApiCurrent, WeatherApiHour } from '@/types/weather-api.type'

/** 실시간 날씨 카드 props */
type CurrentWeatherProps = {
	current: WeatherApiCurrent | null
}

/** 일별 예보 섹션 공통 props */
type ForecastDaysSectionProps = {
	days: ForecastDayEntry[]
}

/** 시간별 예보 섹션 props */
type ForecastHoursSectionProps = {
	hours: WeatherApiHour[]
	astros: ForecastAstroEntry[]
}

/** 일출/월출 등 천체 일정 섹션 공통 props */
type ForecastAstroSectionProps = {
	astros: ForecastAstroEntry[]
}

/** 월출/월몰 섹션 props */
type MoonriseMoonsetSectionProps = {
	astros: ForecastAstroEntry[]
	coordinates: Coordinates
}

/** 시간별 예보 테이블 props */
type HourlyWeatherTableProps = {
	hours: WeatherApiHour[]
	astros: ForecastAstroEntry[]
}

export type {
	CurrentWeatherProps,
	ForecastAstroSectionProps,
	ForecastDaysSectionProps,
	ForecastHoursSectionProps,
	HourlyWeatherTableProps,
	MoonriseMoonsetSectionProps
}
