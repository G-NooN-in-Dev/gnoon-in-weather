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

/** status 표시 기준 날짜의 moon_phase를 찾습니다. */
function findMoonPhaseByDate(astros: ForecastAstroEntry[], date: string): string | null {
	const target = astros.find((astro) => astro.date === date)

	return target?.moon_phase ?? null
}

/**
 * 여러 날짜에 흩어진 월출/월몰을 절대 시각 이벤트로 펼칩니다.
 * 자정 경계를 넘는 월출 status는 "같은 날짜 행"이 아니라 이 타임라인으로 계산해야 안정적입니다.
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
 * - 달이 떠 있는 구간: 가장 최근 moonrise ~ 다음 moonset
 * - 달이 안 떠 있는 구간: 다음 moonrise까지
 *
 * `forecastTodayDate`가 있으면 기기 오늘과 다를 때(stale forecast) null을 반환합니다.
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
	const nextMoonset = events.find((event) => event.kind === 'moonset' && event.at.isAfter(now))

	// 현재 시각이 월출~월몰 구간 안이면 progress를 계산합니다.
	if (previousMoonrise && nextMoonset && previousMoonrise.at.isBefore(nextMoonset.at)) {
		const remaining = calculateAstroDiffTime(now, nextMoonset.at)

		if (!remaining) {
			return null
		}

		const totalMs = nextMoonset.at.diff(previousMoonrise.at)
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
