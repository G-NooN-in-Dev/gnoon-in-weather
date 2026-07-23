import dayjs, { type Dayjs } from 'dayjs'

import createMoonriseStatus from '@/features/weather/lib/create-moonrise-status'
import createSunriseStatus from '@/features/weather/lib/create-sunrise-status'
import type { ForecastAstroEntry } from '@/types/weather-api.type'

type ShouldPreferMoonriseSectionParams = {
	/** 예보 기준 오늘/내일 astro (일출·일몰 판정) */
	forecastAstros: ForecastAstroEntry[]
	/** 어제 astro가 포함된 타임라인 (월출·월몰 판정) */
	moonStatusAstros: ForecastAstroEntry[]
	/** 렌더 시점 기기 시각. 섹션 status와 같은 “지금”을 씁니다. */
	now?: Dayjs
}

/**
 * 밤(해 없음)이고 달이 떠 있으면 월출/월몰 섹션을 일출/일몰보다 위에 둡니다.
 * 렌더 시각 + rise/set으로 판정합니다.
 */
function shouldPreferMoonriseSection({
	forecastAstros,
	moonStatusAstros,
	now = dayjs()
}: ShouldPreferMoonriseSectionParams): boolean {
	const [today, tomorrow] = forecastAstros

	if (!today) {
		return false
	}

	const sunStatus = createSunriseStatus(today, tomorrow, now)

	// 낮(해 표시)이면 일출 섹션을 위에 유지합니다.
	if (!sunStatus || sunStatus.showSun) {
		return false
	}

	const moonStatus = createMoonriseStatus(moonStatusAstros, now, today.date)

	return moonStatus?.showMoon === true
}

export default shouldPreferMoonriseSection
