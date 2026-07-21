import type { ReactNode } from 'react'

const VIEW_WIDTH = 300
const VIEW_HEIGHT = 124
const ARC_CENTER_X = 150
const ARC_BASE_Y = 120
const ARC_RADIUS_X = 125
const ARC_RADIUS_Y = 85
const ARC_STROKE_WIDTH = 4

/** 아치가 차지하는 세로 구간(꼭대기~지평선) — 텍스트를 이 안쪽 중앙에 둡니다. */
const ARC_TOP_PERCENT = ((ARC_BASE_Y - ARC_RADIUS_Y) / VIEW_HEIGHT) * 100
const ARC_HEIGHT_PERCENT = (ARC_RADIUS_Y / VIEW_HEIGHT) * 100

type AstroArcStatusProps = {
	headline: string
	hours: number
	minutes: number
	progress: number
	showMarker: boolean
	markerSize: number
	marker: ReactNode
}

/** progress(0~1)를 타원 아치 위 좌표로 바꿉니다. */
function getArcMarkerPosition(progress: number) {
	const angle = Math.PI * (1 - progress)

	return {
		x: ARC_CENTER_X + ARC_RADIUS_X * Math.cos(angle),
		y: ARC_BASE_Y - ARC_RADIUS_Y * Math.sin(angle)
	}
}

/** 해/달 상태 카드에서 공통으로 쓰는 아치 시각화 셸입니다. */
function AstroArcStatus({ headline, hours, minutes, progress, showMarker, markerSize, marker }: AstroArcStatusProps) {
	const { x: markerX, y: markerY } = getArcMarkerPosition(progress)
	const arcStartX = ARC_CENTER_X - ARC_RADIUS_X
	const arcEndX = ARC_CENTER_X + ARC_RADIUS_X
	const arcPath = `M ${arcStartX} ${ARC_BASE_Y} A ${ARC_RADIUS_X} ${ARC_RADIUS_Y} 0 0 1 ${arcEndX} ${ARC_BASE_Y}`

	return (
		<div className="relative mx-auto w-full max-w-sm">
			<svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="text-grayscale-300 w-full" aria-hidden>
				{/* 아치 안쪽을 채워 중앙 문구를 감싸는 시각적 밀도를 맞춥니다. */}
				<path d={`${arcPath} L ${arcStartX} ${ARC_BASE_Y} Z`} className="fill-grayscale-50" />
				<path d={arcPath} fill="none" stroke="currentColor" strokeWidth={ARC_STROKE_WIDTH} strokeLinecap="round" />
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

			{showMarker ? (
				<div
					className="pointer-events-none absolute z-10"
					style={{
						left: `${(markerX / VIEW_WIDTH) * 100}%`,
						top: `${(markerY / VIEW_HEIGHT) * 100}%`,
						width: markerSize,
						height: markerSize,
						transform: 'translate(-50%, -50%)'
					}}
				>
					{marker}
				</div>
			) : null}
		</div>
	)
}

export default AstroArcStatus
