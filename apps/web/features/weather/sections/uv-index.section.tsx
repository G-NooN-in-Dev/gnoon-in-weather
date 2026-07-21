import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import createUvIndexGuide, { type UvIndexLevel } from '@/features/weather/lib/create-uv-index-guide'
import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'

/**
 * UV 등급별 Badge 색 (낮음→위험: 녹·노·주·빨·보라).
 * 밝은 노랑은 어두운 글자, 나머지는 진한 배경 + 흰 글자로 대비를 맞춥니다.
 */
const UV_LEVEL_BADGE_CLASS_NAME = {
	low: 'bg-success text-white',
	moderate: 'bg-yellow-500 text-white',
	high: 'bg-warning text-white',
	very_high: 'bg-danger text-white',
	extreme: 'bg-purple-500 text-white'
} as const satisfies Record<UvIndexLevel, string>

/**
 * 현재 자외선 지수와 등급별 행동 안내를 보여주는 섹션입니다.
 * 수치·문구 변환은 `createUvIndexGuide`에 위임합니다.
 */
function UvIndexSection({ current }: CurrentWeatherProps) {
	const guide = current ? createUvIndexGuide(current.uv) : null

	return (
		<section>
			<Card className="gap-2 py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">자외선 정보</CardTitle>
				</CardHeader>
				{guide && current ? (
					<CardContent className="flex flex-col gap-3">
						<div className="flex items-baseline gap-2">
							<span className="text-2xl font-semibold tabular-nums">{current.uv}</span>
							<Badge className={cn('font-semibold', UV_LEVEL_BADGE_CLASS_NAME[guide.level])}>{guide.label}</Badge>
							<span className="text-grayscale-500 text-sm">({guide.rangeLabel})</span>
						</div>
						<ul className="text-grayscale-700 list-disc space-y-1 pl-5 text-sm">
							{guide.tips.map((tip) => (
								<li key={tip}>{tip}</li>
							))}
						</ul>
					</CardContent>
				) : (
					<EmptyState
						icon={<SearchX className="text-grayscale-600 size-10" />}
						className="border-none"
						title="자외선 데이터 없음"
						description="자외선 정보를 찾을 수 없습니다"
					>
						<p className="text-muted-foreground text-sm">위치를 확인한 뒤 다시 조회해 주세요.</p>
					</EmptyState>
				)}
			</Card>
		</section>
	)
}

export default UvIndexSection
