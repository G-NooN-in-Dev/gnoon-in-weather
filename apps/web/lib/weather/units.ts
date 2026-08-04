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

/** 단위 옵션 타입(label+value): 선택 UI와 값 검증에 함께 사용 */
type WeatherUnitOption<T extends string> = { label: string; value: T }

/** 단위 목록: value(검증용)와 label(UI 표시용)을 함께 담는 단일 출처 */
const TEMPERATURE_UNITS = [
	{ label: '섭씨 (C)', value: 'c' },
	{ label: '화씨 (F)', value: 'f' }
] as const satisfies ReadonlyArray<WeatherUnitOption<TemperatureUnit>>
const DISTANCE_UNITS = [
	{ label: 'km', value: 'km' },
	{ label: 'miles', value: 'miles' }
] as const satisfies ReadonlyArray<WeatherUnitOption<DistanceUnit>>
const PRECIPITATION_UNITS = [
	{ label: 'mm', value: 'mm' },
	{ label: 'inch', value: 'inch' }
] as const satisfies ReadonlyArray<WeatherUnitOption<PrecipitationUnit>>
const SNOW_DEPTH_UNITS = [
	{ label: 'cm', value: 'cm' },
	{ label: 'inch', value: 'inch' }
] as const satisfies ReadonlyArray<WeatherUnitOption<SnowDepthUnit>>

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
export type { WeatherUnitOption }
