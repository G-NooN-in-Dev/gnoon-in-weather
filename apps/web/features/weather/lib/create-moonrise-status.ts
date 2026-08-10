import dayjs, { type Dayjs } from 'dayjs'

import {
	calculateAstroDiffTime,
	clampProgress,
	isAstroForecastCurrent,
	parseAstroDateTime,
	resolveAstroMoonsetAt
} from '@/features/weather/lib/astro-status-utils'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type MoonriseStatusHeadline = '월몰까지' | '월출까지'

/**
 * 월출 현황 아치 UI에 넘기는 표시용 결과.
 * `progress`는 현재 월출~월몰 구간에서 현재 시각의 비율(0~1)입니다.
 */
type MoonriseStatus = {
	headline: MoonriseStatusHeadline
	hours: number
	minutes: number
	progress: number
	showMoon: boolean
	moonPhase: string | null
}

type AstroEvent = {
	kind: 'moonrise' | 'moonset'
	at: Dayjs
}

/** status 기준 날짜의 `moon_phase`를 찾습니다. */
function findMoonPhaseByDate(astros: ForecastAstroEntry[], date: string): string | null {
	const target = astros.find((astro) => astro.date === date)

	return target?.moon_phase ?? null
}

/**
 * 날짜별 월출/월몰을 절대 시각 타임라인으로 펼칩니다.
 * 자정을 넘는 구간은 날짜 행이 아니라 이 순서로 판정합니다.
 */
function createMoonEvents(astros: ForecastAstroEntry[]): AstroEvent[] {
	return astros
		.flatMap((astro) => {
			const moonrise = parseAstroDateTime(astro.date, astro.moonrise)
			const moonset = resolveAstroMoonsetAt(astro)
			const events: AstroEvent[] = []

			if (moonrise) {
				events.push({ kind: 'moonrise', at: moonrise })
			}

			if (moonset) {
				events.push({ kind: 'moonset', at: moonset })
			}

			return events
		})
		.sort((a, b) => a.at.valueOf() - b.at.valueOf())
}

/**
 * 월출 현황(남은 시간 + 달 progress)을 만듭니다.
 * - 떠 있음: 최근 월출 ~ 그 월출의 바로 다음 월몰(아직 안 지난 경우) → 「월몰까지」
 * - 안 떠 있음: 다음 월출까지 → 「월출까지」
 *
 * `forecastTodayDate`가 있으면 기기 오늘과 다를 때(stale forecast) null입니다.
 */
function createMoonriseStatus(
	astros: ForecastAstroEntry[],
	now: Dayjs = dayjs(),
	forecastTodayDate?: string
): MoonriseStatus | null {
	// 어제 보강분이 섞여 있어도, forecast 첫날 기준으로 stale 여부를 봅니다.
	if (forecastTodayDate !== undefined && !isAstroForecastCurrent(forecastTodayDate, now)) {
		return null
	}

	const events = createMoonEvents(astros)

	if (events.length === 0) {
		return null
	}

	const previousMoonrise = [...events].reverse().find((event) => event.kind === 'moonrise' && !event.at.isAfter(now))
	// 최근 월출에 짝이 되는 바로 다음 월몰. (아직 안 지났을 때만 「떠 있음」)
	const pairedMoonset = previousMoonrise
		? events.find((event) => event.kind === 'moonset' && event.at.isAfter(previousMoonrise.at))
		: undefined

	if (previousMoonrise && pairedMoonset && pairedMoonset.at.isAfter(now)) {
		const remaining = calculateAstroDiffTime(now, pairedMoonset.at)

		if (!remaining) {
			return null
		}

		const totalMs = pairedMoonset.at.diff(previousMoonrise.at)
		const elapsedMs = now.diff(previousMoonrise.at)
		const progress = totalMs > 0 ? elapsedMs / totalMs : 0
		const moonPhase = findMoonPhaseByDate(astros, previousMoonrise.at.format('YYYY-MM-DD'))
		const { hours, minutes } = remaining

		return {
			headline: '월몰까지',
			hours,
			minutes,
			progress: clampProgress(progress),
			showMoon: true,
			moonPhase
		}
	}

	const nextMoonrise = events.find((event) => event.kind === 'moonrise' && event.at.isAfter(now))

	if (!nextMoonrise) {
		return null
	}

	const remaining = calculateAstroDiffTime(now, nextMoonrise.at)

	if (!remaining) {
		return null
	}

	const { hours, minutes } = remaining

	return {
		headline: '월출까지',
		hours,
		minutes,
		progress: 0,
		showMoon: false,
		moonPhase: findMoonPhaseByDate(astros, nextMoonrise.at.format('YYYY-MM-DD'))
	}
}

export { createMoonEvents, createMoonriseStatus }
export type { AstroEvent, MoonriseStatus, MoonriseStatusHeadline }
