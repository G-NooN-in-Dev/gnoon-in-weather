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
	/**
	 * 부모가 복구한 어제 astro.
	 * 자정 경계 status·섹션 순서 판정과 같은 타임라인을 쓰기 위해 주입받습니다.
	 */
	yesterdayAstro?: ForecastAstroEntry | null
}

/** 일출/월출 섹션 조합기 props */
type AstroScheduleSectionProps = {
	astros: ForecastAstroEntry[]
	coordinates: Coordinates
}

export type {
	AstroScheduleSectionProps,
	CurrentWeatherProps,
	ForecastAstroSectionProps,
	ForecastDaysSectionProps,
	ForecastHoursSectionProps,
	MoonriseMoonsetSectionProps
}
