import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import AstroScheduleTable from '@/features/weather/components/astro-schedule-table'
import type { ForecastAstroSectionProps } from '@/features/weather/types/weather-component.type'
import { formatTime12To24 } from '@/utils/format-utils'

function SunriseSunsetSection({ astros }: ForecastAstroSectionProps) {
	return (
		<section>
			<Card className="py-4">
				<CardHeader>
					<CardTitle className="text-xl font-bold">일출/일몰</CardTitle>
				</CardHeader>
				{astros.length > 0 ? (
					<CardContent className="flex flex-col gap-2">
						{/* TODO - 일출 현황 */}
						<div>일출 현황</div>
						<AstroScheduleTable
							data={astros.map(({ date, sunrise, sunset }) => ({
								date,
								left: formatTime12To24(sunrise),
								right: formatTime12To24(sunset)
							}))}
							leftHeader="일출"
							rightHeader="일몰"
						/>
					</CardContent>
				) : (
					<EmptyState
						icon={<SearchX className="text-grayscale-600 size-10" />}
						className="border-none"
						title="일출/일몰 데이터 없음"
						description="일출/일몰 데이터를 찾을 수 없습니다"
					>
						<p className="text-muted-foreground text-sm">위치를 확인한 뒤 다시 조회해 주세요.</p>
					</EmptyState>
				)}
			</Card>
		</section>
	)
}

export default SunriseSunsetSection
