'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildKakaoApiUrl } from '@/lib/kakao/api-url'
import { writeLatestSearchedLocationCookie } from '@/lib/location/cookie'
import { requestCurrentGeolocation } from '@/lib/location/geolocation'
import { buildWeatherApiUrl } from '@/lib/weather/api-url'
import { isForecastStale } from '@/lib/weather/is-forecast-stale'
import { isRealtimeStale } from '@/lib/weather/is-realtime-stale'
import { HOME_FORECAST_DAYS, HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { CoordAddressLabelResponse, LocationSearchItem } from '@/types/kakao-local.type'
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
	/** 카카오 검색 결과 선택 — 라벨·좌표를 카카오 값으로 고정한 뒤 날씨를 조회합니다. */
	selectLocation: (item: LocationSearchItem) => void
}

/** 좌표가 동일한지 판단합니다. */
function isSameCoordinates(a: Coordinates, b: Coordinates): boolean {
	return a.lat === b.lat && a.lng === b.lng
}

/**
 * SSR initialWeather를 추가 API 호출 없이 쓸 수 있는지 판단합니다.
 * realtime TTL·forecast 기준 날짜가 모두 유효해야 합니다.
 */
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
 * - 표시 라벨은 카카오(검색·역지오코딩·쿠키) 값을 유지하고 WeatherAPI location으로 덮지 않습니다.
 * - SSR 데이터가 5분 이내이고 forecast 날짜가 기준 오늘이면 refetch 생략
 * - realtime만 stale이고 forecast는 오늘이면 current.json만 fresh 조회
 * - forecast 날짜 stale·좌표 변경·SSR 실패 시 전체 조회 (SSR stale면 fresh 우회)
 * - 검색/현재위치 재선택은 fetchCount를 올려 동일 좌표여도 fresh refetch합니다.
 */
function useWeather({
	initialLocation,
	initialWeather = null,
	initialError = null
}: UseWeatherOptions): UseWeatherResult {
	const { lat: initialLat, lng: initialLng, label, placeId: initialPlaceId, address: initialAddress } = initialLocation

	const [fetchParams, setFetchParams] = useState<Coordinates>(() => ({
		lat: initialLat,
		lng: initialLng
	}))
	const [fetchCount, setFetchCount] = useState(0)
	const [locationLabel, setLocationLabel] = useState(label)
	const [locationPlaceId, setLocationPlaceId] = useState<string | null>(initialPlaceId ?? null)
	const [locationAddress, setLocationAddress] = useState(initialAddress ?? '')
	const [weather, setWeather] = useState<WeatherSummary | null>(initialWeather)
	const [loading, setLoading] = useState(() => initialWeather === null && initialError === null)
	const [isLocating, setIsLocating] = useState(false)
	const [error, setError] = useState<AppApiError | null>(initialError)

	const location = useMemo<LocationState>(
		() => ({
			...fetchParams,
			label: locationLabel,
			placeId: locationPlaceId,
			address: locationAddress
		}),
		[fetchParams, locationLabel, locationPlaceId, locationAddress]
	)

	const { lat: fetchLat, lng: fetchLng } = fetchParams

	useEffect(() => {
		const controller = new AbortController()
		const isSameAsInitial = isSameCoordinates({ lat: fetchLat, lng: fetchLng }, { lat: initialLat, lng: initialLng })
		const isUserInitiated = fetchCount > 0

		// 마운트 직후 SSR 데이터만 단축 사용. 사용자 재선택은 항상 다시 조회합니다.
		if (
			!isUserInitiated &&
			canUseInitialWeatherWithoutFetch(fetchLat, fetchLng, initialLat, initialLng, initialWeather)
		) {
			return
		}

		/** 날씨만 반영하고, 라벨은 카카오/쿠키 값을 유지한 채 쿠키에 저장합니다. */
		function applyWeatherSummary(summary: WeatherSummary, coordinates: Coordinates) {
			setWeather(summary)
			setLocationLabel((currentLabel) => {
				writeLatestSearchedLocationCookie({
					...coordinates,
					label: currentLabel
				})

				return currentLabel
			})
		}

		async function fetchWeather() {
			await Promise.resolve()

			if (controller.signal.aborted) {
				return
			}

			setLoading(true)
			setError(null)

			try {
				// realtime만 stale이고 forecast 날짜는 기준 오늘이면 current.json만 fresh 조회
				if (
					!isUserInitiated &&
					isSameAsInitial &&
					initialWeather &&
					isRealtimeStale(initialWeather) &&
					!isForecastStale(initialWeather)
				) {
					const response = await fetch(
						buildWeatherApiUrl('realtime', {
							lat: fetchLat,
							lng: fetchLng,
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

				// 사용자 재선택·SSR stale이면 Data Cache를 우회해 fresh 조회합니다.
				const shouldFetchFresh =
					isUserInitiated ||
					(isSameAsInitial &&
						initialWeather !== null &&
						(isRealtimeStale(initialWeather) || isForecastStale(initialWeather)))

				const response = await fetch(
					buildWeatherApiUrl(undefined, {
						lat: fetchLat,
						lng: fetchLng,
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
	}, [fetchLat, fetchLng, fetchCount, initialLat, initialLng, initialWeather])

	/** 검색 결과 선택 — 카카오 label을 먼저 고정한 뒤 좌표로 날씨를 조회합니다. */
	const selectLocation = useCallback((item: LocationSearchItem) => {
		const { id, label, address, lat, lng } = item

		setError(null)
		setLoading(true)
		setLocationLabel(label)
		setLocationPlaceId(id)
		setLocationAddress(address)
		setFetchParams({ lat, lng })
		setFetchCount((count) => count + 1)
	}, [])

	const requestCurrentPosition = useCallback(() => {
		setIsLocating(true)
		setError(null)

		void (async () => {
			const result = await requestCurrentGeolocation()

			if (!result.ok) {
				setIsLocating(false)
				setError(result.error)
				return
			}

			const { latitude, longitude } = result.position.coords

			try {
				// GPS 좌표를 카카오 도로명/지번 라벨로 바꿉니다.
				const response = await fetch(
					buildKakaoApiUrl('coord2address', {
						lat: latitude,
						lng: longitude
					})
				)
				const data = await response.json()

				if (!response.ok) {
					setIsLocating(false)
					setError((data.error as AppApiError | undefined) ?? null)
					return
				}

				const { label: nextLabel } = data as CoordAddressLabelResponse

				setIsLocating(false)
				setLoading(true)
				setLocationLabel(nextLabel || '현재 위치')
				setLocationPlaceId(null)
				setLocationAddress('')
				setFetchParams({ lat: latitude, lng: longitude })
				setFetchCount((count) => count + 1)
			} catch {
				setIsLocating(false)
				setError({
					provider: 'kakao',
					code: 0,
					key: 'KAKAO_INTERNAL_ERROR',
					status: 500,
					retryable: true,
					message: '현재 위치 주소를 불러오는 중 오류가 발생했습니다.'
				})
			}
		})()
	}, [])

	return {
		location,
		weather,
		loading,
		isLocating,
		error,
		requestCurrentPosition,
		selectLocation
	}
}

export default useWeather
export type { UseWeatherOptions, UseWeatherResult }
