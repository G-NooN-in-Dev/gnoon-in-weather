import dayjs from 'dayjs'

import createUvIndexGuide from '@/features/weather/lib/create-uv-index-guide'
import { WIND_DIRECTIONS } from '@/lib/weather/constants'
import { WeatherApiCurrent, WeatherApiDay, WeatherApiHour } from '@/types/weather-api.type'
import { WeatherUnits } from '@/types/weather-units.type'
import { formatTime12To24 } from '@/utils/format'

const ASTRO_UNAVAILABLE_MESSAGE = /^Does not (rise|set) today$/i

/** 3일 예보·천체 일정 등에서 쓰는 일차 라벨 */
const DAY_LABELS = ['오늘', '내일', '모레'] as const

/** 예보 일차 인덱스를 화면 라벨(오늘/내일/모레)로 변환합니다. */
function formatDayLabel(dayIndex: number): string {
	return DAY_LABELS[dayIndex] ?? `${dayIndex + 1}일차`
}

/**
 * wind_degree(0~360)를 8방위 화면 라벨로 변환합니다.
 * API의 wind_dir(16방위) 대신 각도 기준으로 45° 구간에 반올림합니다.
 */
function formatWindDirection(degree: number): string {
	const normalized = ((degree % 360) + 360) % 360
	const index = Math.round(normalized / 45) % 8

	return `${WIND_DIRECTIONS[index]}풍`
}

/** UV 지수를 화면 표시용 문자열로 변환합니다. (등급 정의는 createUvIndexGuide와 공유) */
function formatUvIndexLabel(uv: number): string {
	const uvGuide = createUvIndexGuide(uv)
	return uvGuide.label
}

/** 온도 단위 설정 */
function formatTemperatureLabel(units: WeatherUnits): string {
	const { temperature } = units
	return temperature === 'c' ? '°C' : '°F'
}

/** 현재 날씨 온도 표시용 문자열 생성 */
function formatCurrentLabelTemperature(current: WeatherApiCurrent, units: WeatherUnits) {
	const { temp_c, temp_f, feelslike_c, feelslike_f } = current
	const { temperature } = units

	const useFahrenheit = temperature === 'f'

	return {
		temp: useFahrenheit ? temp_f : temp_c,
		feelslike: useFahrenheit ? feelslike_f : feelslike_c
	}
}

/** 시간별 날씨 온도 표시용 문자열 생성 */
function formatHourLabelTemperature(hour: WeatherApiHour, units: WeatherUnits) {
	const { temp_c, temp_f, feelslike_c, feelslike_f } = hour
	const { temperature } = units

	const useFahrenheit = temperature === 'f'

	return {
		temp: useFahrenheit ? temp_f : temp_c,
		feelslike: useFahrenheit ? feelslike_f : feelslike_c
	}
}

/** 예보 날씨 온도 표시용 문자열 생성 */
function formatForecastLabelTemperature(day: WeatherApiDay, units: WeatherUnits) {
	const { maxtemp_c, maxtemp_f, mintemp_c, mintemp_f, avgtemp_c, avgtemp_f } = day
	const { temperature } = units

	const useFahrenheit = temperature === 'f'

	return {
		maxtemp: useFahrenheit ? maxtemp_f : maxtemp_c,
		mintemp: useFahrenheit ? mintemp_f : mintemp_c,
		avgtemp: useFahrenheit ? avgtemp_f : avgtemp_c
	}
}

/** km/h 를 m/s로 변환합니다. (소수점 첫째 자리 반올림) */
function formatKphToMps(kph: number): number {
	return Math.floor((kph / 3.6) * 10) / 10
}

/** 속도 단위 */
function formatSpeedUnitLabel(units: WeatherUnits): string {
	const { distance } = units
	return distance === 'miles' ? 'mph' : 'm/s'
}

/** 거리 단위 */
function formatDistanceUnitLabel(units: WeatherUnits): string {
	const { distance } = units
	return distance === 'miles' ? 'mi' : 'km'
}

/** 현재 날씨 속도 & 거리 표시용 문자열 생성 */
function formatCurrentLabelSpeedAndDistance(current: WeatherApiCurrent, units: WeatherUnits) {
	const { wind_mph, wind_kph, vis_miles, vis_km } = current
	const { distance } = units

	const useMiles = distance === 'miles'

	return {
		wind: useMiles ? wind_mph : formatKphToMps(wind_kph),
		visibility: useMiles ? vis_miles : vis_km
	}
}

/** 시간별 날씨 속도 & 거리 표시용 문자열 생성 */
function formatHourLabelSpeedAndDistance(hour: WeatherApiHour, units: WeatherUnits) {
	const { wind_mph, wind_kph, vis_miles, vis_km } = hour
	const { distance } = units

	const useMiles = distance === 'miles'

	return {
		wind: useMiles ? wind_mph : formatKphToMps(wind_kph),
		visibility: useMiles ? vis_miles : vis_km
	}
}

/** 예보 날씨 속도 & 거리 표시용 문자열 생성 */
function formatForecastLabelSpeedAndDistance(day: WeatherApiDay, units: WeatherUnits) {
	const { maxwind_mph, maxwind_kph, avgvis_miles, avgvis_km } = day
	const { distance } = units

	const useMiles = distance === 'miles'

	return {
		maxwind: useMiles ? maxwind_mph : formatKphToMps(maxwind_kph),
		avgvisibility: useMiles ? avgvis_miles : avgvis_km
	}
}

/** cm를 inch로 변환합니다. (소수점 둘째 자리 반올림) */
function formatCmToInch(cm: number): number {
	return Math.floor((cm / 2.54) * 100) / 100
}

/** 강수량 단위 */
function formatPrecipitationUnitLabel(units: WeatherUnits): string {
	const { precipitation } = units
	return precipitation === 'inch' ? 'in' : 'mm'
}

/** 적설량 단위 */
function formatSnowDepthUnitLabel(units: WeatherUnits): string {
	const { snowDepth } = units
	return snowDepth === 'inch' ? 'in' : 'cm'
}

/** 현재 날씨 강수량 & 적설량 표시용 문자열 생성 */
function formatCurrentPrecipitationAndSnowDepth(current: WeatherApiCurrent, units: WeatherUnits) {
	const { precip_mm, precip_in, snow_cm } = current
	const { precipitation, snowDepth } = units

	const useInch = precipitation === 'inch'
	const useCm = snowDepth === 'cm'

	return {
		precip: useInch ? precip_in : precip_mm,
		snowDepth: useCm ? snow_cm : formatCmToInch(snow_cm)
	}
}

/** 시간별 날씨 강수량 & 적설량 표시용 문자열 생성 */
function formatHourPrecipitationAndSnowDepth(hour: WeatherApiHour, units: WeatherUnits) {
	const { precip_mm, precip_in, snow_cm } = hour
	const { precipitation, snowDepth } = units

	const useInch = precipitation === 'inch'
	const useCm = snowDepth === 'cm'

	return {
		precip: useInch ? precip_in : precip_mm,
		snowDepth: useCm ? snow_cm : formatCmToInch(snow_cm)
	}
}

/** 예보 날씨 강수량 & 적설량 표시용 문자열 생성 */
function formatForecastPrecipitationAndSnowDepth(day: WeatherApiDay, units: WeatherUnits) {
	const { totalprecip_mm, totalprecip_in, totalsnow_cm } = day
	const { precipitation, snowDepth } = units

	const useInch = precipitation === 'inch'
	const useCm = snowDepth === 'cm'

	return {
		totalprecip: useInch ? totalprecip_in : totalprecip_mm,
		totalsnowDepth: useCm ? totalsnow_cm : formatCmToInch(totalsnow_cm)
	}
}

/** WeatherAPI CDN 아이콘 크기 (legend·미리보기용) */
type WeatherConditionIconSize = 64 | 128

/** 낮/밤 아이콘 경로 구분 */
type WeatherConditionPeriod = 'day' | 'night'

/**
 * WeatherAPI `condition.icon`을 Next Image `src`에 쓸 수 있는 절대 URL로 변환합니다.
 * API는 `//cdn.weatherapi.com/...` 형태의 프로토콜 상대 URL을 반환합니다.
 */
function formatWeatherIconUrl(icon: string): string {
	if (icon.startsWith('http')) {
		return icon
	}

	return `https:${icon}`
}

/**
 * WeatherAPI CDN 아이콘 URL을 조립합니다.
 * `weather-conditions.json`의 `icon` 번호와 day/night 폴더를 조합할 때 사용합니다.
 */
function getWeatherConditionIconUrl(
	icon: number,
	period: WeatherConditionPeriod = 'day',
	size: WeatherConditionIconSize = 64
): string {
	return `https://cdn.weatherapi.com/weather/${size}x${size}/${period}/${icon}.png`
}

/** 천체 일정 시간 표시용 문자열 생성 */
function formatAstroScheduleTime(time: string): string {
	if (ASTRO_UNAVAILABLE_MESSAGE.test(time)) {
		return '-'
	}

	return formatTime12To24(time)
}

/** 예보 일차 인덱스를 계산합니다. */
function getForecastDayIndex(date: string, baseDate: string): number {
	return dayjs(date).startOf('day').diff(dayjs(baseDate).startOf('day'), 'day')
}

/** 시간별 날씨 시간 표시용 문자열 생성 */
function formatHourlyTimeLabel(hour: WeatherApiHour, baseDate: string): string {
	const { time } = hour
	const parsedTime = dayjs(time)
	const hourValue = parsedTime.hour()
	const dayIndex = getForecastDayIndex(time, baseDate)

	if (hourValue === 0) {
		return formatDayLabel(dayIndex)
	}

	return `${String(hourValue).padStart(2, '0')}시`
}

export type { WeatherConditionIconSize, WeatherConditionPeriod }

export {
	formatAstroScheduleTime,
	formatCurrentLabelSpeedAndDistance,
	formatCurrentLabelTemperature,
	formatCurrentPrecipitationAndSnowDepth,
	formatDayLabel,
	formatDistanceUnitLabel,
	formatForecastLabelSpeedAndDistance,
	formatForecastLabelTemperature,
	formatForecastPrecipitationAndSnowDepth,
	formatHourLabelSpeedAndDistance,
	formatHourLabelTemperature,
	formatHourlyTimeLabel,
	formatHourPrecipitationAndSnowDepth,
	formatKphToMps,
	formatPrecipitationUnitLabel,
	formatSnowDepthUnitLabel,
	formatSpeedUnitLabel,
	formatTemperatureLabel,
	formatUvIndexLabel,
	formatWeatherIconUrl,
	formatWindDirection,
	getWeatherConditionIconUrl
}
