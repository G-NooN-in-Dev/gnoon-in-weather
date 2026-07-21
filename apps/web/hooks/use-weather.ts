'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { writeLatestSearchedLocationCookie } from '@/lib/location/cookie'
import { formatWeatherLocationLabel } from '@/lib/weather/format-location'
import { isForecastStale } from '@/lib/weather/is-forecast-stale'
import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import { HOME_FORECAST_DAYS, HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { Coordinates, LocationState } from '@/types/location.type'
import type { WeatherApiRealtimeResponse, WeatherSummary } from '@/types/weather-api.type'

type UseWeatherOptions = {
	/** 서버 page에서 전달한 초기 위치 */
	initialLocation: LocationState
	/** 서버 SSR로 미리 채운 날씨. 5분 이내면 refetch 없이 그대로 사용합니다. */
	initialWeather?: WeatherSummary | null
	/** 서버 초기 로드 실패 시 클라이언트에 넘길 에러 */
	initialError?: AppApiError | null
}

type UseWeatherResult = {
	location: LocationState
	weather: WeatherSummary | null
	loading: boolean
	isLocating: boolean
	error: AppApiError | null
	requestCurrentPosition: () => void
}
/** 좌표가 동일한지 판단합니다. */
function isSameCoordinates(a: Coordinates, b: Coordinates): boolean {
	return a.lat === b.lat && a.lng === b.lng
}

/** SSR initialWeather를 추가 API 호출 없이 쓸 수 있는지 판단합니다. */
function canUseInitialWeatherWithoutFetch(
	fetchLat: number,
	fetchLng: number,
	initialLat: number,
	initialLng: number,
	initialWeather: WeatherSummary | null
): boolean {
	return (
		initialWeather !== null &&
		isSameCoordinates({ lat: fetchLat, lng: fetchLng }, { lat: initialLat, lng: initialLng }) &&
		!isRealtimeStale(initialWeather) &&
		!isForecastStale(initialWeather)
	)
}

/**
 * 날씨 조회 훅.
 * - SSR 데이터가 5분 이내이고 forecast 날짜가 오늘이면 refetch 생략
 * - realtime만 stale이면 current.json만 fresh 조회
 * - forecast 날짜 stale·좌표 변경·SSR 실패 시 전체 조회
 */
function useWeather({
	initialLocation,
	initialWeather = null,
	initialError = null
}: UseWeatherOptions): UseWeatherResult {
	const { lat: initialLat, lng: initialLng, label } = initialLocation

	const [fetchParams, setFetchParams] = useState<Coordinates>(() => ({
		lat: initialLat,
		lng: initialLng
	}))
	const [locationLabel, setLocationLabel] = useState(label)
	const [weather, setWeather] = useState<WeatherSummary | null>(initialWeather)
	const [loading, setLoading] = useState(
		() => !canUseInitialWeatherWithoutFetch(initialLat, initialLng, initialLat, initialLng, initialWeather)
	)
	const [isLocating, setIsLocating] = useState(false)
	const [error, setError] = useState<AppApiError | null>(initialError)

	const location = useMemo<LocationState>(
		() => ({
			...fetchParams,
			label: locationLabel
		}),
		[fetchParams, locationLabel]
	)

	const { lat: fetchLat, lng: fetchLng } = fetchParams

	useEffect(() => {
		const controller = new AbortController()
		const isSameAsInitial = isSameCoordinates({ lat: fetchLat, lng: fetchLng }, { lat: initialLat, lng: initialLng })

		function applyWeatherSummary(summary: WeatherSummary, coordinates: Coordinates) {
			const nextLabel = formatWeatherLocationLabel(summary.realtime.location)
			const nextLocation: LocationState = {
				...coordinates,
				label: nextLabel
			}

			setWeather(summary)
			setLocationLabel(nextLabel)
			writeLatestSearchedLocationCookie(nextLocation)
		}

		async function fetchWeather() {
			if (canUseInitialWeatherWithoutFetch(fetchLat, fetchLng, initialLat, initialLng, initialWeather)) {
				setLoading(false)
				return
			}

			setLoading(true)
			setError(null)

			try {
				// realtime만 stale이고 forecast 날짜는 오늘이면 current.json만 fresh 조회
				if (isSameAsInitial && initialWeather && isRealtimeStale(initialWeather) && !isForecastStale(initialWeather)) {
					const response = await fetch(
						`/api/weather/realtime?lat=${fetchLat}&lng=${fetchLng}&lang=${HOME_WEATHER_LANG}&fresh=true`,
						{ signal: controller.signal }
					)
					const data = await response.json()

					if (!response.ok) {
						setError((data.error as AppApiError | undefined) ?? null)
						return
					}

					const realtime = data as WeatherApiRealtimeResponse
					applyWeatherSummary(
						{
							realtime,
							forecast: initialWeather.forecast
						},
						{ lat: fetchLat, lng: fetchLng }
					)
					return
				}

				const response = await fetch(
					`/api/weather?lat=${fetchLat}&lng=${fetchLng}&lang=${HOME_WEATHER_LANG}&days=${HOME_FORECAST_DAYS}`,
					{ signal: controller.signal }
				)
				const data = await response.json()

				if (!response.ok) {
					setError((data.error as AppApiError | undefined) ?? null)
					return
				}

				applyWeatherSummary(data as WeatherSummary, { lat: fetchLat, lng: fetchLng })
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
	}, [fetchLat, fetchLng, initialLat, initialLng, initialWeather])

	const requestCurrentPosition = useCallback(() => {
		if (!navigator.geolocation) {
			setError({
				provider: 'weatherapi',
				code: 0,
				key: 'GEOLOCATION_UNAVAILABLE',
				status: 400,
				retryable: false,
				message: '이 브라우저에서는 현재 위치를 사용할 수 없습니다.'
			})
			return
		}

		setIsLocating(true)
		setError(null)

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords
				setIsLocating(false)
				setLoading(true)
				setFetchParams({ lat: latitude, lng: longitude })
				setLocationLabel('')
			},
			() => {
				setIsLocating(false)
				setError({
					provider: 'weatherapi',
					code: 0,
					key: 'GEOLOCATION_DENIED',
					status: 400,
					retryable: true,
					message: '현재 위치 권한이 필요합니다. 브라우저 설정을 확인해주세요.'
				})
			},
			{ enableHighAccuracy: false, timeout: 10_000 }
		)
	}, [])

	return {
		location,
		weather,
		loading,
		isLocating,
		error,
		requestCurrentPosition
	}
}

export { useWeather, type UseWeatherOptions, type UseWeatherResult }
