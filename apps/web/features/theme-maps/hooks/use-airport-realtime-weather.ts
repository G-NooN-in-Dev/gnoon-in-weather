'use client'

import { useEffect, useState } from 'react'

import type { Airport } from '@/features/theme-maps/lib/airports'
import { buildWeatherApiUrl } from '@/lib/weather/api-url'
import { HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { WeatherApiRealtimeResponse } from '@/types/weather-api.type'

type UseAirportRealtimeWeatherResult = {
	realtimeWeather: WeatherApiRealtimeResponse | null
	loading: boolean
	error: AppApiError | null
}

/**
 * 선택한 공항 좌표로 `/api/weather/realtime`만 조회합니다.
 * 공항이 바뀌면(컴포넌트 remount 또는 deps 변경) 이전 요청을 abort합니다.
 */
function useAirportRealtimeWeather(airport: Airport): UseAirportRealtimeWeatherResult {
	const [realtimeWeather, setRealtimeWeather] = useState<WeatherApiRealtimeResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<AppApiError | null>(null)

	const { iata, lat, lng } = airport

	useEffect(() => {
		const controller = new AbortController()

		async function fetchRealtime() {
			try {
				const response = await fetch(
					buildWeatherApiUrl('realtime', {
						lat,
						lng,
						lang: HOME_WEATHER_LANG
					}),
					{ signal: controller.signal }
				)
				const data = await response.json()

				if (!response.ok) {
					setError((data.error as AppApiError | undefined) ?? null)
					return
				}

				setRealtimeWeather(data as WeatherApiRealtimeResponse)
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

		void fetchRealtime()

		return () => {
			controller.abort()
		}
	}, [iata, lat, lng])

	return { realtimeWeather, loading, error }
}

export default useAirportRealtimeWeather
