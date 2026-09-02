'use client'

import dayjs from 'dayjs'

import useYesterdayMoonAstro from '@/features/weather/hooks/use-yesterday-moon-astro'
import { shouldPreferMoonriseSection } from '@/features/weather/lib/should-prefer-moonrise-section'
import type { AstroScheduleSectionProps } from '@/features/weather/types/weather-component.type'
import useIsClient from '@/hooks/use-is-client'

import MoonriseMoonsetSection from './moonrise-moonset.section'
import SunriseSunsetSection from './sunrise-sunset.section'

/**
 * 일출/일몰·월출/월몰 섹션 조합기.
 * 렌더 시점 기준으로 밤+달 뜸이면 월출 섹션을 위에 배치합니다.
 * 어제 astro는 여기서 한 번만 복구해 월출 status·순서 판정에 공유합니다.
 */
function AstroScheduleSection({ astros, coordinates }: AstroScheduleSectionProps) {
	const isClient = useIsClient()
	const yesterdayAstro = useYesterdayMoonAstro({
		astros,
		coordinates: isClient ? coordinates : null
	})
	const moonStatusAstros = yesterdayAstro ? [yesterdayAstro, ...astros] : astros

	// hydrate 전엔 기본 순서(일출 → 월출). 클라에서만 렌더 시각으로 순서를 바꿉니다.
	const preferMoonrise =
		isClient &&
		shouldPreferMoonriseSection({
			forecastAstros: astros,
			moonStatusAstros,
			now: dayjs()
		})

	const sunriseSection = <SunriseSunsetSection key="sunrise-sunset" astros={astros} />
	const moonriseSection = (
		<MoonriseMoonsetSection key="moonrise-moonset" astros={astros} yesterdayAstro={yesterdayAstro} />
	)

	return preferMoonrise ? (
		<>
			{moonriseSection}
			{sunriseSection}
		</>
	) : (
		<>
			{sunriseSection}
			{moonriseSection}
		</>
	)
}

export default AstroScheduleSection
