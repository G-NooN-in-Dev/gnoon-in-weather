import dayjs, { type Dayjs } from 'dayjs'

import {
	calculateAstroDiffTime,
	clampProgress,
	isAstroForecastCurrent,
	parseAstroDateTime
} from '@/features/weather/lib/astro-status-utils'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type SunriseStatusHeadline = '일몰까지' | '일출까지'

/**
 * 일출 현황 아치 UI에 넘기는 표시용 결과.
 * `progress`는 오늘 일출~일몰 구간에서 현재 시각의 비율(0~1)입니다.
 */
type SunriseStatus = {
	headline: SunriseStatusHeadline
	hours: number
	minutes: number
	progress: number
	showSun: boolean
}

/**
 * 오늘/내일 천체 일정으로 일출 현황(남은 시간 + 태양 progress)을 만듭니다.
 * - 낮: 일몰까지 + 태양 표시
 * - 일몰 이후: 내일 일출까지 남은 시간(문구는 '일출까지') + 태양 숨김
 * - 일출 전: 오늘 일출까지 + 태양 숨김
 *
 * `now`는 기기 현재 시각을 기준으로 합니다.
 * forecast 첫날이 오늘이 아니거나( stale cache ), 목표 시각이 이미 지났으면 null입니다.
 */
function createSunriseStatus(
	today: ForecastAstroEntry,
	tomorrow?: ForecastAstroEntry,
	now: Dayjs = dayjs()
): SunriseStatus | null {
	const { date, sunrise: sunriseRaw, sunset: sunsetRaw } = today

	// Data Cache가 어제·이전 날짜를 먼저 주면 0시간 0분이 나오므로 status를 숨깁니다.
	if (!isAstroForecastCurrent(date, now)) {
		return null
	}

	const sunrise = parseAstroDateTime(date, sunriseRaw)
	const sunset = parseAstroDateTime(date, sunsetRaw)

	if (!sunrise || !sunset) {
		return null
	}

	const isDaytime = (now.isAfter(sunrise) || now.isSame(sunrise)) && now.isBefore(sunset)

	// 낮: 일출 ~ 일몰 → 일몰까지 남은 시간 + 아치 위 태양 위치
	if (isDaytime) {
		const remaining = calculateAstroDiffTime(now, sunset)

		if (!remaining) {
			return null
		}

		const dayLengthMs = sunset.diff(sunrise)
		const elapsedMs = now.diff(sunrise)
		const progress = dayLengthMs > 0 ? elapsedMs / dayLengthMs : 0
		const { hours, minutes } = remaining

		return {
			headline: '일몰까지',
			hours,
			minutes,
			progress: clampProgress(progress),
			showSun: true
		}
	}

	// 밤: 오늘 일몰 이후 → 다음 일출까지(문구는 '일출까지'), 태양 숨김
	if (now.isAfter(sunset) || now.isSame(sunset)) {
		if (!tomorrow) {
			return null
		}

		const { date: tomorrowDate, sunrise: tomorrowSunrise } = tomorrow
		const nextSunrise = parseAstroDateTime(tomorrowDate, tomorrowSunrise)

		if (!nextSunrise) {
			return null
		}

		const remaining = calculateAstroDiffTime(now, nextSunrise)

		if (!remaining) {
			return null
		}

		const { hours, minutes } = remaining

		return {
			headline: '일출까지',
			hours,
			minutes,
			progress: 0,
			showSun: false
		}
	}

	// 새벽: 오늘 일출 전 → 일출까지, 태양 숨김
	const remaining = calculateAstroDiffTime(now, sunrise)

	if (!remaining) {
		return null
	}

	const { hours, minutes } = remaining

	return {
		headline: '일출까지',
		hours,
		minutes,
		progress: 0,
		showSun: false
	}
}

export default createSunriseStatus

export type { SunriseStatus, SunriseStatusHeadline }
