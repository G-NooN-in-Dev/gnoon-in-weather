import dayjs, { type Dayjs } from 'dayjs'

import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'
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

/** API 천체 시각(`06:32 AM`)을 해당 날짜의 Dayjs로 변환합니다. */
function parseAstroDateTime(date: string, time: string): Dayjs | null {
	const time24 = formatAstroScheduleTime(time)

	if (time24 === '-') {
		return null
	}

	return dayjs(`${date} ${time24}`)
}

/** from → to 까지 남은 시·분을 계산합니다. 음수는 0으로 보정합니다. */
function calculateAstroDiffTime(from: Dayjs, to: Dayjs) {
	const totalMinutes = Math.max(0, to.diff(from, 'minute'))

	return {
		hours: Math.floor(totalMinutes / 60),
		minutes: totalMinutes % 60
	}
}

/**
 * 오늘/내일 천체 일정으로 일출 현황(남은 시간 + 태양 progress)을 만듭니다.
 * - 낮: 일몰까지 + 태양 표시
 * - 일몰 이후: 내일 일출까지 남은 시간(문구는 '일출까지') + 태양 숨김
 * - 일출 전: 오늘 일출까지 + 태양 숨김
 *
 * `now`는 기기 현재 시각을 기준으로 합니다.
 */
function createSunriseStatus(
	today: ForecastAstroEntry,
	tomorrow?: ForecastAstroEntry,
	now: Dayjs = dayjs()
): SunriseStatus | null {
	const { date, sunrise: sunriseRaw, sunset: sunsetRaw } = today
	const sunrise = parseAstroDateTime(date, sunriseRaw)
	const sunset = parseAstroDateTime(date, sunsetRaw)

	if (!sunrise || !sunset) {
		return null
	}

	const isDaytime = (now.isAfter(sunrise) || now.isSame(sunrise)) && now.isBefore(sunset)

	// 낮: 일출 ~ 일몰 → 일몰까지 남은 시간 + 아치 위 태양 위치
	if (isDaytime) {
		const { hours, minutes } = calculateAstroDiffTime(now, sunset)
		const dayLengthMs = sunset.diff(sunrise)
		const elapsedMs = now.diff(sunrise)
		const progress = dayLengthMs > 0 ? elapsedMs / dayLengthMs : 0

		return {
			headline: '일몰까지',
			hours,
			minutes,
			progress: Math.min(1, Math.max(0, progress)),
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

		const { hours, minutes } = calculateAstroDiffTime(now, nextSunrise)

		return {
			headline: '일출까지',
			hours,
			minutes,
			progress: 0,
			showSun: false
		}
	}

	// 새벽: 오늘 일출 전 → 일출까지, 태양 숨김
	const { hours, minutes } = calculateAstroDiffTime(now, sunrise)

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
