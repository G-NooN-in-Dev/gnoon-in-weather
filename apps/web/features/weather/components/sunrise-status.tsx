import { Sun } from 'lucide-react'

import type { SunriseStatus as SunriseStatusData } from '@/features/weather/lib/create-sunrise-status'

/**
 * SVG viewBox 기준.
 * 타원 아치가 가운데 문구를 감싸도록 높이·배치를 잡습니다.
 * VIEW_HEIGHT는 지평선(ARC_BASE_Y) 아래로 조금만 남겨 스트로크·태양 아이콘이 잘리지 않게 합니다.
 */
const VIEW_WIDTH = 300
const VIEW_HEIGHT = 124
const ARC_CENTER_X = 150
const ARC_BASE_Y = 120
const ARC_RADIUS_X = 125
const ARC_RADIUS_Y = 85
const ARC_STROKE_WIDTH = 4
const SUN_SIZE = 28

/** 아치가 차지하는 세로 구간(꼭대기~지평선) — 텍스트를 이 안쪽에 둠 */
const ARC_TOP_PERCENT = ((ARC_BASE_Y - ARC_RADIUS_Y) / VIEW_HEIGHT) * 100
const ARC_HEIGHT_PERCENT = (ARC_RADIUS_Y / VIEW_HEIGHT) * 100

type SunriseStatusProps = {
	status: SunriseStatusData
}

/**
 * progress(0~1)를 타원 아치 위 좌표로 바꿉니다.
 * 0 = 왼쪽(일출), 1 = 오른쪽(일몰).
 */
function getSunPosition(progress: number) {
	const angle = Math.PI * (1 - progress)

	return {
		x: ARC_CENTER_X + ARC_RADIUS_X * Math.cos(angle),
		y: ARC_BASE_Y - ARC_RADIUS_Y * Math.sin(angle)
	}
}

/**
 * 일출 현황: 타원 아치가 가운데 남은 시간을 감싸는 구조
 * 텍스트는 아치 꼭대기~지평선 구간의 정중앙에 둡니다.
 */
function SunriseStatus({ status }: SunriseStatusProps) {
	const { headline, hours, minutes, progress, showSun } = status
	const { x: sunX, y: sunY } = getSunPosition(progress)

	const arcStartX = ARC_CENTER_X - ARC_RADIUS_X
	const arcEndX = ARC_CENTER_X + ARC_RADIUS_X
	const arcPath = `M ${arcStartX} ${ARC_BASE_Y} A ${ARC_RADIUS_X} ${ARC_RADIUS_Y} 0 0 1 ${arcEndX} ${ARC_BASE_Y}`

	return (
		<div className="relative mx-auto w-full max-w-sm">
			<svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="text-grayscale-300 w-full" aria-hidden>
				{/* 아치 안쪽을 살짝 채워 '감싸는' 느낌이 나도록 */}
				<path d={`${arcPath} L ${arcStartX} ${ARC_BASE_Y} Z`} className="fill-grayscale-50" />
				{/* 일출(왼) → 일몰(오) 타원 아치 */}
				<path d={arcPath} fill="none" stroke="currentColor" strokeWidth={ARC_STROKE_WIDTH} strokeLinecap="round" />
				{/* 지평선 */}
				<line
					x1={arcStartX - 8}
					y1={ARC_BASE_Y}
					x2={arcEndX + 8}
					y2={ARC_BASE_Y}
					stroke="currentColor"
					strokeWidth="2"
					className="text-grayscale-200"
				/>
			</svg>

			{/* 아치 안쪽(꼭대기~지평선) 정중앙에 남은 시간 */}
			<div
				className="pointer-events-none absolute inset-x-0 flex flex-col items-center justify-center text-center"
				style={{
					top: `${ARC_TOP_PERCENT}%`,
					height: `${ARC_HEIGHT_PERCENT}%`
				}}
			>
				<p className="text-grayscale-600 text-sm">{headline}</p>
				<p className="text-lg font-semibold tabular-nums">
					{hours}시간 {minutes}분
				</p>
			</div>

			{/* 낮 구간에만: progress % 지점에 태양 아이콘 (아치 선 위) */}
			{showSun ? (
				<div
					className="pointer-events-none absolute z-10"
					style={{
						left: `${(sunX / VIEW_WIDTH) * 100}%`,
						top: `${(sunY / VIEW_HEIGHT) * 100}%`,
						width: SUN_SIZE,
						height: SUN_SIZE,
						transform: 'translate(-50%, -50%)'
					}}
				>
					<Sun className="text-warning fill-warning size-full" strokeWidth={1.5} aria-hidden />
				</div>
			) : null}
		</div>
	)
}

export default SunriseStatus
