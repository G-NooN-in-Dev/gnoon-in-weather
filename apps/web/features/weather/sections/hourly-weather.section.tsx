import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import type { ForecastHoursSectionProps } from '@/features/weather/types/weather-component.type'

import HourlyWeatherTable from '../components/hourly-weather-table'
import WeatherConditionLegendPopover from '../components/weather-condition-legend-popover'

function HourlyWeatherSection({ hours, astros }: ForecastHoursSectionProps) {
	return (
		<section>
			<Card className="py-4">
				<CardHeader className="flex items-center gap-3">
					<CardTitle className="text-xl font-bold">시간별 날씨</CardTitle>
					<WeatherConditionLegendPopover />
				</CardHeader>
				<CardContent>
					{hours.length > 0 ? (
						<HourlyWeatherTable hours={hours} astros={astros} />
					) : (
						<EmptyState
							className="border-none"
							icon={<SearchX className="text-grayscale-600 size-10" />}
							title="시간별 날씨 데이터 없음"
							description="시간별 날씨 데이터를 찾을 수 없습니다"
						/>
					)}
				</CardContent>
			</Card>
		</section>
	)
}

export default HourlyWeatherSection
