'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { buildWeatherApiUrl } from '@/lib/weather/api-url'
import { isForecastAstroEntry } from '@/lib/weather/is-forecast-astro-entry'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type Coordinates = {
	lat: number
	lng: number
}

type UseYesterdayMoonAstroOptions = {
	coordinates: Coordinates | null
	astros: ForecastAstroEntry[]
}

function buildCacheKey({ lat, lng }: Coordinates, date: string) {
	return `moon-astro:${lat.toFixed(4)},${lng.toFixed(4)}:${date}`
}

/**
 * 월출/월몰 자정 경계 계산을 위해 어제 astro를 복구합니다.
 * 1) 먼저 지역+날짜 캐시(localStorage)를 조회하고,
 * 2) 없으면 astronomy API로 어제 1일만 보강 조회합니다.
 */
function useYesterdayMoonAstro({ coordinates, astros }: UseYesterdayMoonAstroOptions) {
	const [yesterdayAstro, setYesterdayAstro] = useState<ForecastAstroEntry | null>(null)

	// 다음 날 새벽 계산을 위해 "오늘 astro"를 지역별 캐시에 저장합니다.
	useEffect(() => {
		if (!coordinates || astros.length === 0) {
			return
		}

		const todayAstro = astros[0]

		if (!todayAstro) {
			return
		}

		const cacheKey = buildCacheKey(coordinates, todayAstro.date)

		try {
			localStorage.setItem(cacheKey, JSON.stringify(todayAstro))
		} catch {
			// 저장 실패(사파리 private 모드 등)는 치명적이지 않아 무시합니다.
		}
	}, [coordinates, astros])

	useEffect(() => {
		if (!coordinates || astros.length === 0) {
			return
		}

		const today = astros[0]

		if (!today) {
			return
		}

		const activeCoordinates = coordinates
		const yesterdayDate = dayjs(today.date).subtract(1, 'day').format('YYYY-MM-DD')
		const cacheKey = buildCacheKey(activeCoordinates, yesterdayDate)
		let isMounted = true

		async function resolveYesterdayAstro() {
			await Promise.resolve()

			if (!isMounted) {
				return
			}

			try {
				const cached = localStorage.getItem(cacheKey)

				if (cached) {
					const parsed: unknown = JSON.parse(cached)

					if (isForecastAstroEntry(parsed) && isMounted) {
						setYesterdayAstro(parsed)
						return
					}
				}
			} catch {
				// 캐시 파싱 실패 시 네트워크 보강으로 넘어갑니다.
			}

			try {
				const { lat, lng } = activeCoordinates
				const response = await fetch(
					buildWeatherApiUrl('astronomy', {
						lat,
						lng,
						date: yesterdayDate
					})
				)

				const data: unknown = await response.json()
				const astro = data && typeof data === 'object' && 'astro' in data ? (data as { astro: unknown }).astro : null

				if (!response.ok || !isForecastAstroEntry(astro)) {
					if (isMounted) {
						setYesterdayAstro(null)
					}

					return
				}

				if (isMounted) {
					setYesterdayAstro(astro)
				}

				try {
					localStorage.setItem(cacheKey, JSON.stringify(astro))
				} catch {
					// 저장 실패는 무시합니다.
				}
			} catch {
				if (isMounted) {
					setYesterdayAstro(null)
				}
			}
		}

		void resolveYesterdayAstro()

		return () => {
			isMounted = false
		}
	}, [coordinates, astros])

	return yesterdayAstro
}

export default useYesterdayMoonAstro
