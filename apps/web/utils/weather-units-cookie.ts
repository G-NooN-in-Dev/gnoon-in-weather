import {
	DISTANCE_UNITS,
	PRECIPITATION_UNITS,
	TEMPERATURE_UNITS,
	WEATHER_UNITS_COOKIE_MAX_AGE_SECONDS,
	WEATHER_UNITS_COOKIE_NAME
} from '@/libs/weather-units'
import { DistanceUnit, PrecipitationUnit, TemperatureUnit, WeatherUnits } from '@/types/weather-units.type'

import { readBrowserCookie } from './cookie'

type WeatherUnitsCookie = {
	temperature: TemperatureUnit
	distance: DistanceUnit
	precipitation: PrecipitationUnit
}

/** 단위 값이 유효한지 검사합니다. */
function isWeatherUnit<T extends string>(value: unknown, allowed: readonly T[]): value is T {
	return typeof value === 'string' && (allowed as readonly string[]).includes(value)
}

/** 쿠키 JSON을 WeatherUnits로 안전하게 변환합니다. */
function parseWeatherUnitsCookie(value: string): WeatherUnits | null {
	try {
		const parsed = JSON.parse(value) as Partial<WeatherUnits>
		const { temperature, distance, precipitation } = parsed

		if (
			!isWeatherUnit(temperature, TEMPERATURE_UNITS) ||
			!isWeatherUnit(distance, DISTANCE_UNITS) ||
			!isWeatherUnit(precipitation, PRECIPITATION_UNITS)
		) {
			return null
		}

		return { temperature, distance, precipitation }
	} catch {
		return null
	}
}

/** 브라우저에 저장된 단위 설정을 읽습니다. */
function readWeatherUnitsCookie(): WeatherUnits | null {
	if (typeof document === 'undefined') {
		return null
	}

	const encoded = readBrowserCookie(WEATHER_UNITS_COOKIE_NAME)
	return encoded ? parseWeatherUnitsCookie(decodeURIComponent(encoded)) : null
}

/** 단위 설정을 쿠키에 저장합니다. */
function writeWeatherUnitsCookie(units: WeatherUnits): void {
	if (typeof document === 'undefined') {
		return
	}

	const payload = JSON.stringify(units satisfies WeatherUnitsCookie)
	document.cookie = `${WEATHER_UNITS_COOKIE_NAME}=${encodeURIComponent(payload)}; path=/; max-age=${WEATHER_UNITS_COOKIE_MAX_AGE_SECONDS}; samesite=lax`
}

export { readWeatherUnitsCookie, writeWeatherUnitsCookie }
