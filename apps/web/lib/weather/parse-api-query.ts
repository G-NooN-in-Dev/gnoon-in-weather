import { HOME_FORECAST_DAYS, HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { Coordinates } from '@/types/location.type'
import type { WeatherFetchParams } from '@/types/weather-api.type'

/** 쿼리스트링에서 좌표를 파싱합니다. 유효하지 않으면 null을 반환합니다. */
function parseCoordinates(searchParams: URLSearchParams): Coordinates | null {
	const lat = Number(searchParams.get('lat'))
	const lng = Number(searchParams.get('lng'))

	if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
		return null
	}

	return { lat, lng }
}

/**
 * `/api/weather` 쿼리스트링을 `loadWeatherSummary` 파라미터로 변환합니다.
 * 좌표가 유효하지 않으면 null을 반환합니다.
 */
function parseWeatherFetchParams(searchParams: URLSearchParams): WeatherFetchParams | null {
	const coordinates = parseCoordinates(searchParams)

	if (!coordinates) {
		return null
	}

	const lang = searchParams.get('lang') ?? HOME_WEATHER_LANG
	const daysParam = Number(searchParams.get('days') ?? HOME_FORECAST_DAYS)
	const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : HOME_FORECAST_DAYS

	return { ...coordinates, lang, days }
}

export { parseCoordinates, parseWeatherFetchParams }
