import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Info } from 'lucide-react'

import type { ForecastHoursSectionProps } from '@/features/weather/types/weather-component.type'

function HourlyWeatherSection({ hours }: ForecastHoursSectionProps) {
	return (
		<section>
			<Card className="py-4">
				<CardHeader className="flex items-center gap-3">
					<CardTitle className="text-xl font-bold">시간별 날씨</CardTitle>
					<Info className="text-grayscale-600 cursor-pointer" size={16} />
				</CardHeader>
				<CardContent>
					{/* TODO - 시간별 날씨 테이블 */}
					{hours.length > 0 ? (
						<p className="text-grayscale-600 text-sm">{hours.length}개 시간대 데이터 수신됨</p>
					) : (
						<div>테이블 (예정)</div>
					)}
				</CardContent>
			</Card>
		</section>
	)
}

export default HourlyWeatherSection
