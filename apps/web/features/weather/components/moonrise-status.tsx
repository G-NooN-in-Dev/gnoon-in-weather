import Image from 'next/image'

import AstroArcStatus from '@/features/weather/components/astro-arc-status'
import type { MoonriseStatus as MoonriseStatusData } from '@/features/weather/lib/create-moonrise-status'

const MOON_SIZE = 40

type MoonriseStatusProps = {
	status: MoonriseStatusData
}

const MOON_PHASE_ICON_MAP: Record<string, string> = {
	'New Moon': '/images/moon/moon-new.svg',
	'Waxing Crescent': '/images/moon/moon-waxing-crescent.svg',
	'First Quarter': '/images/moon/moon-first-quarter.svg',
	'Waxing Gibbous': '/images/moon/moon-waxing-gibbous.svg',
	'Full Moon': '/images/moon/moon-full.svg',
	'Waning Gibbous': '/images/moon/moon-waning-gibbous.svg',
	'Last Quarter': '/images/moon/moon-last-quarter.svg',
	'Waning Crescent': '/images/moon/moon-waning-crescent.svg'
}

/** WeatherAPI moon_phase 문자열을 public 아이콘 경로로 변환합니다. */
function getMoonPhaseIconSrc(moonPhase: string | null) {
	if (!moonPhase) {
		return null
	}

	return MOON_PHASE_ICON_MAP[moonPhase] ?? null
}

/** 월출 현황: 일출 카드와 같은 구조로 달 아이콘 progress를 표시합니다. */
function MoonriseStatus({ status }: MoonriseStatusProps) {
	const { headline, hours, minutes, progress, showMoon, moonPhase } = status
	const moonPhaseIconSrc = getMoonPhaseIconSrc(moonPhase)

	return (
		<AstroArcStatus
			headline={headline}
			hours={hours}
			minutes={minutes}
			progress={progress}
			showMarker={showMoon && Boolean(moonPhaseIconSrc)}
			markerSize={MOON_SIZE}
			marker={
				moonPhaseIconSrc ? (
					<Image src={moonPhaseIconSrc} alt="" width={MOON_SIZE} height={MOON_SIZE} aria-hidden />
				) : null
			}
		/>
	)
}

export default MoonriseStatus
