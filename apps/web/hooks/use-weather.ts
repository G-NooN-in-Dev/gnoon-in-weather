'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { HOME_FORECAST_DAYS, HOME_WEATHER_LANG } from '@/services/weather.loader'
import type { AppApiError } from '@/types/error.type'
import type { Coordinates, LocationState } from '@/types/location.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import { formatWeatherLocationLabel } from '@/utils/format-weather-location'
import { writeLatestSearchedLocationCookie } from '@/utils/location-cookie'

type UseWeatherOptions = {
	/** 서버 page에서 전달한 초기 위치 */
	initialLocation: LocationState
	/** 서버에서 미리 조회한 날씨. 있으면 첫 마운트 fetch를 건너뜁니다. */
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

/**
 * GPS·좌표 변경 시 클라이언트에서 날씨를 다시 조회합니다.
 * 초기 데이터는 서버 page에서 props로 받고, 이 훅은 이후 상호작용만 담당합니다.
 */
function useWeather({
	initialLocation,
	initialWeather = null,
	initialError = null
}: UseWeatherOptions): UseWeatherResult {
	const { lat, lng, label } = initialLocation

	// 날씨 API 재조회 트리거. 좌표만 담고 label은 별도 state로 분리합니다.
	// GPS 직후에는 좌표만 갱신하고, 응답의 location으로 label을 채웁니다.
	const [fetchParams, setFetchParams] = useState<Coordinates>({ lat, lng })
	// 화면에 보여줄 위치 이름. fetchParams와 합쳐 location을 만듭니다.
	const [locationLabel, setLocationLabel] = useState(label)
	// /api/weather 응답 전체. 섹션 컴포넌트에 그대로 전달합니다.
	const [weather, setWeather] = useState<WeatherSummary | null>(initialWeather)
	// fetchParams 변경으로 날씨 API를 호출하는 동안 true.
	const [loading, setLoading] = useState(!initialWeather)
	// GPS 권한 요청·getCurrentPosition 대기 중 true. API loading과 별개입니다.
	const [isLocating, setIsLocating] = useState(false)
	// API 실패·GPS 거부·브라우저 미지원 등 공통 에러 슬롯.
	const [error, setError] = useState<AppApiError | null>(initialError)
	// 서버에서 initialWeather를 받았으면 첫 useEffect fetch를 한 번 건너뜁니다.
	const skipInitialFetchRef = useRef(Boolean(initialWeather))

	// fetchParams(좌표) + locationLabel(이름) → UI·쿠키에 쓰는 LocationState.
	const location = useMemo<LocationState>(
		() => ({
			...fetchParams,
			label: locationLabel
		}),
		[fetchParams, locationLabel]
	)

	// 좌표가 바뀔 때마다 날씨 API를 호출하고, 성공 시 쿠키에 최근 위치를 저장합니다.
	useEffect(() => {
		if (skipInitialFetchRef.current) {
			skipInitialFetchRef.current = false
			return
		}

		const { lat, lng } = fetchParams
		const controller = new AbortController()

		async function fetchWeather() {
			setLoading(true)
			setError(null)

			try {
				const response = await fetch(
					`/api/weather?lat=${lat}&lng=${lng}&lang=${HOME_WEATHER_LANG}&days=${HOME_FORECAST_DAYS}`,
					{ signal: controller.signal }
				)
				const data = await response.json()

				if (!response.ok) {
					setError((data.error as AppApiError | undefined) ?? null)
					return
				}

				const summary = data as WeatherSummary
				const nextLabel = formatWeatherLocationLabel(summary.realtime.location)
				const nextLocation: LocationState = {
					lat,
					lng,
					label: nextLabel
				}

				setWeather(summary)
				setLocationLabel(nextLabel)
				writeLatestSearchedLocationCookie(nextLocation)
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
	}, [fetchParams])

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
				setFetchParams({ lat: latitude, lng: longitude })
				setLocationLabel('')
				setIsLocating(false)
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
