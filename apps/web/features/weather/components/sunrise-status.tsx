import { Sun } from 'lucide-react'

import AstroArcStatus from '@/features/weather/components/astro-arc-status'
import type { SunriseStatus as SunriseStatusData } from '@/features/weather/lib/create-sunrise-status'

const SUN_SIZE = 28

type SunriseStatusProps = {
	status: SunriseStatusData
}

/** 일출 상태를 공통 아치 컴포넌트에 매핑해 표시합니다. */
function SunriseStatus({ status }: SunriseStatusProps) {
	const { headline, hours, minutes, progress, showSun } = status

	return (
		<AstroArcStatus
			headline={headline}
			hours={hours}
			minutes={minutes}
			progress={progress}
			showMarker={showSun}
			markerSize={SUN_SIZE}
			marker={<Sun className="text-warning fill-warning size-full" strokeWidth={1.5} aria-hidden />}
		/>
	)
}

export default SunriseStatus
