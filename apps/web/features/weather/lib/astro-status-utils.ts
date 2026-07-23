import dayjs, { type Dayjs } from 'dayjs'

import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type AstroDiffTime = {
	hours: number
	minutes: number
}

/** API 천체 시각(`06:32 AM`)을 해당 날짜의 Dayjs로 변환합니다. */
function parseAstroDateTime(date: string, time: string): Dayjs | null {
	const time24 = formatAstroScheduleTime(time)

	if (time24 === '-') {
		return null
	}

	const parsed = dayjs(`${date} ${time24}`)

	// Invalid Date 객체가 truthy로 남는 것을 막습니다.
	return parsed.isValid() ? parsed : null
}

/**
 * 한 날짜 행의 월몰 절대 시각을 구합니다.
 * WeatherAPI는 `월출 15:02` + `월몰 12:05 AM`처럼 자정을 넘는 쌍을 같은 날짜에 넣으므로,
 * 월몰이 월출보다 이르면(+같으면) 다음날로 보정합니다.
 */
function resolveAstroMoonsetAt(astro: Pick<ForecastAstroEntry, 'date' | 'moonrise' | 'moonset'>): Dayjs | null {
	const { date, moonrise: moonriseRaw, moonset: moonsetRaw } = astro
	const moonrise = parseAstroDateTime(date, moonriseRaw)
	const moonset = parseAstroDateTime(date, moonsetRaw)

	if (!moonset) {
		return null
	}

	if (moonrise && !moonset.isAfter(moonrise)) {
		return moonset.add(1, 'day')
	}

	return moonset
}

/**
 * from → to 까지 남은 시·분을 계산합니다.
 * 목표 시각이 이미 지났으면 null을 반환합니다. (stale forecast → 0시간 0분 방지)
 * 1분 미만 남으면 { 0, 0 }입니다.
 */
function calculateAstroDiffTime(from: Dayjs, to: Dayjs): AstroDiffTime | null {
	if (to.isBefore(from)) {
		return null
	}

	const totalMinutes = to.diff(from, 'minute')

	return {
		hours: Math.floor(totalMinutes / 60),
		minutes: totalMinutes % 60
	}
}

/** UI progress 비율이 안전하게 0~1 범위를 유지하도록 보정합니다. */
function clampProgress(progress: number) {
	return Math.min(1, Math.max(0, progress))
}

/**
 * forecast 첫날(`astros[0].date`)이 기기 기준 오늘과 같은지 확인합니다.
 * Data Cache stale-while-revalidate로 어제·이전 날짜가 오면 status를 숨길 때 씁니다.
 */
function isAstroForecastCurrent(astroDate: string | undefined, now: Dayjs = dayjs()): boolean {
	if (!astroDate) {
		return false
	}

	return astroDate === now.format('YYYY-MM-DD')
}

export { calculateAstroDiffTime, clampProgress, isAstroForecastCurrent, parseAstroDateTime, resolveAstroMoonsetAt }
export type { AstroDiffTime }
