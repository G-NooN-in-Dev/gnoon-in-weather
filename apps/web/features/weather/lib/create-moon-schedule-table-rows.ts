import dayjs, { type Dayjs } from 'dayjs'

import { resolveAstroMoonsetAt } from '@/features/weather/lib/astro-status-utils'
import { formatLunarDateExtra } from '@/features/weather/lib/format-lunar-date'
import {
	formatAstroScheduleTime,
	formatDayLabel,
	TODAY_DAY_LABEL_OFFSET,
	YESTERDAY_DAY_LABEL_OFFSET
} from '@/features/weather/lib/format-weather-values'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type MoonScheduleTableRow = {
	date: string
	left: string
	right: string
	/** 행 중앙 라벨. 어제 기준 윈도면 `어제`부터 시작합니다. */
	dayLabel: string
	dateExtra?: string
}

/**
 * 어제 행의 월몰(자정 보정 후)이 아직 안 지났으면 표를 어제 기준 3일로 엽니다.
 * 예: 월몰 07.24 00:05, now 07.24 00:00 → 어제·오늘·내일
 */
function shouldUseYesterdayBasedMoonSchedule(yesterdayAstro: ForecastAstroEntry | null, now: Dayjs = dayjs()): boolean {
	if (!yesterdayAstro) {
		return false
	}

	const yesterdayMoonsetAt = resolveAstroMoonsetAt(yesterdayAstro)

	if (!yesterdayMoonsetAt) {
		return false
	}

	return yesterdayMoonsetAt.isAfter(now)
}

/**
 * 월출/월몰 표에 넣을 3일과 라벨을 만듭니다.
 * - 어제 월몰 미경과 + yesterdayAstro 있음 → [어제, 오늘, 내일]
 * - 그 외 → forecast 오늘 기준 3일 (오늘/내일/모레)
 */
function createMoonScheduleTableRows(
	forecastAstros: ForecastAstroEntry[],
	yesterdayAstro: ForecastAstroEntry | null = null,
	now: Dayjs = dayjs()
): MoonScheduleTableRow[] {
	const useYesterdayWindow = shouldUseYesterdayBasedMoonSchedule(yesterdayAstro, now)
	const sourceAstros =
		useYesterdayWindow && yesterdayAstro ? [yesterdayAstro, ...forecastAstros.slice(0, 2)] : forecastAstros
	const labelOffset = useYesterdayWindow ? YESTERDAY_DAY_LABEL_OFFSET : TODAY_DAY_LABEL_OFFSET

	return sourceAstros.map((astro, index) => {
		const { date, moonrise, moonset } = astro

		return {
			date,
			left: formatAstroScheduleTime(moonrise),
			right: formatAstroScheduleTime(moonset),
			dayLabel: formatDayLabel(index, labelOffset),
			dateExtra: formatLunarDateExtra(date) ?? undefined
		}
	})
}

export default createMoonScheduleTableRows

export { shouldUseYesterdayBasedMoonSchedule }

export type { MoonScheduleTableRow }
