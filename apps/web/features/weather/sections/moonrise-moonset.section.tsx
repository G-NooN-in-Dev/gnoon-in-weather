import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import AstroScheduleTable from '@/features/weather/components/astro-schedule-table'
import { formatLunarDateExtra } from '@/features/weather/lib/format-lunar-date'
import { formatAstroScheduleTime } from '@/features/weather/lib/format-weather-values'
import type { ForecastAstroSectionProps } from '@/features/weather/types/weather-component.type'

function MoonriseMoonsetSection({ astros }: ForecastAstroSectionProps) {
	return (
		<section>
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">월출/월몰</CardTitle>
				</CardHeader>
				{astros.length > 0 ? (
					<CardContent className="flex flex-col gap-2">
						{/* TODO - 월출 현황 */}
						<div>월출 현황</div>
						{/* dateExtra로 음력만 월출 섹션에 추가 (일출 테이블은 변경 없음) */}
						<AstroScheduleTable
							data={astros.map(({ date, moonrise, moonset }) => ({
								date,
								left: formatAstroScheduleTime(moonrise),
								right: formatAstroScheduleTime(moonset),
								dateExtra: formatLunarDateExtra(date) ?? undefined
							}))}
							leftHeader="월출"
							rightHeader="월몰"
						/>
					</CardContent>
				) : (
					<EmptyState
						icon={<SearchX className="text-grayscale-600 size-10" />}
						className="border-none"
						title="월출/월몰 데이터 없음"
						description="월출/월몰 데이터를 찾을 수 없습니다"
					>
						<p className="text-muted-foreground text-sm">위치를 확인한 뒤 다시 조회해 주세요.</p>
					</EmptyState>
				)}
			</Card>
		</section>
	)
}

export default MoonriseMoonsetSection
