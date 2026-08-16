'use client'

import { useEffect, useState } from 'react'

import type { Airport } from '@/features/theme-maps/lib/airports'
import { buildWeatherApiUrl } from '@/lib/weather/api-url'
import { isForecastStale } from '@/lib/weather/is-forecast-stale'
import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import { HOME_FORECAST_DAYS, HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherApiRealtimeResponse, WeatherSummary } from '@/types/weather-api.type'

type UseAirportWeatherOptions = {
	airport: Airport
	initialWeather?: WeatherSummary | null
	initialError?: AppApiError | null
}

type UseAirportWeatherResult = {
	weather: WeatherSummary | null
	loading: boolean
	error: AppApiError | null
}

/**
 * SSR initialWeather를 추가 API 호출 없이 쓸 수 있는지 판단합니다.
 * realtime TTL·forecast 기준 날짜가 모두 유효해야 합니다.
 */
function canUseInitialWeatherWithoutFetch(initialWeather: WeatherSummary | null): boolean {
	return initialWeather !== null && !isRealtimeStale(initialWeather) && !isForecastStale(initialWeather)
}

/**
 * 공항 상세용 날씨 조회 훅.
 * 좌표는 공항 고정이며 홈 위치 쿠키·GPS·검색은 쓰지 않습니다.
 * SSR 데이터가 유효하면 refetch를 생략하고, stale이면 홈과 같은 규칙으로 보정합니다.
 */
function useAirportWeather({
	airport,
	initialWeather = null,
	initialError = null
}: UseAirportWeatherOptions): UseAirportWeatherResult {
	const { lat, lng } = airport
	const [weather, setWeather] = useState<WeatherSummary | null>(initialWeather)
	const [loading, setLoading] = useState(() => initialWeather === null && initialError === null)
	const [error, setError] = useState<AppApiError | null>(initialError)

	useEffect(() => {
		const controller = new AbortController()

		async function fetchWeather() {
			if (canUseInitialWeatherWithoutFetch(initialWeather)) {
				setLoading(false)
				return
			}

			setLoading(true)
			setError(null)

			try {
				if (initialWeather && isRealtimeStale(initialWeather) && !isForecastStale(initialWeather)) {
					const response = await fetch(
						buildWeatherApiUrl('realtime', {
							lat,
							lng,
							lang: HOME_WEATHER_LANG,
							fresh: true
						}),
						{ signal: controller.signal }
					)
					const data = await response.json()

					if (!response.ok) {
						setError((data.error as AppApiError | undefined) ?? null)
						return
					}

					setWeather({
						realtime: data as WeatherApiRealtimeResponse,
						forecast: initialWeather.forecast
					})
					return
				}

				const shouldFetchFresh =
					initialWeather !== null && (isRealtimeStale(initialWeather) || isForecastStale(initialWeather))

				const response = await fetch(
					buildWeatherApiUrl(undefined, {
						lat,
						lng,
						lang: HOME_WEATHER_LANG,
						days: HOME_FORECAST_DAYS,
						fresh: shouldFetchFresh || undefined
					}),
					{ signal: controller.signal }
				)
				const data = await response.json()

				if (!response.ok) {
					setError((data.error as AppApiError | undefined) ?? null)
					return
				}

				setWeather(data as WeatherSummary)
			} catch (fetchError) {
				if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
					return
				}

				setError({
					provider: 'weatherapi',
					code: 0,
					key: 'WEATHER_INTERNAL_ERROR',
					status: 500,
					retryable: true,
					message: '날씨 정보를 불러오는 중 오류가 발생했습니다.'
				})
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false)
				}
			}
		}

		void fetchWeather()

		return () => {
			controller.abort()
		}
	}, [lat, lng, initialWeather])

	return { weather, loading, error }
}

export default useAirportWeather
export type { UseAirportWeatherOptions, UseAirportWeatherResult }
