import type {
	DistanceUnit,
	PrecipitationUnit,
	SnowDepthUnit,
	TemperatureUnit,
	WeatherUnits
} from '@/types/weather-units.type'

/** 단위 설정 쿠키 이름 */
const WEATHER_UNITS_COOKIE_NAME = 'weather-units'

/** 단위 설정 쿠키 유지 기간(30일) */
const WEATHER_UNITS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const TEMPERATURE_UNITS = ['c', 'f'] as const satisfies readonly TemperatureUnit[]
const DISTANCE_UNITS = ['km', 'miles'] as const satisfies readonly DistanceUnit[]
const PRECIPITATION_UNITS = ['mm', 'inch'] as const satisfies readonly PrecipitationUnit[]
const SNOW_DEPTH_UNITS = ['cm', 'inch'] as const satisfies readonly SnowDepthUnit[]

/** 기본 단위: 섭씨 · km · mm */
const DEFAULT_WEATHER_UNITS = {
	temperature: 'c',
	distance: 'km',
	precipitation: 'mm',
	snowDepth: 'cm'
} satisfies WeatherUnits

export {
	DEFAULT_WEATHER_UNITS,
	DISTANCE_UNITS,
	PRECIPITATION_UNITS,
	SNOW_DEPTH_UNITS,
	TEMPERATURE_UNITS,
	WEATHER_UNITS_COOKIE_MAX_AGE_SECONDS,
	WEATHER_UNITS_COOKIE_NAME
}
