import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import DailyWeatherCard from '@/features/weather/components/daily-weather-card'
import type { ForecastDaysSectionProps } from '@/features/weather/types/weather-component.type'

import WeatherApiCredit from '../components/weather-api-credit'

function DailyWeatherSection({ days }: ForecastDaysSectionProps) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="pl-2 text-2xl font-bold">3일 예보</h2>
			<div className="grid grid-cols-3 gap-4">
				{days.length > 0 ? (
					days.map((day, index) => <DailyWeatherCard key={day.date_epoch} day={day} dayIndex={index} />)
				) : (
					<EmptyState
						className="col-span-3"
						icon={<SearchX className="text-grayscale-600 size-10" />}
						title="예보 데이터 없음"
						description="예보 데이터를 찾을 수 없습니다"
					/>
				)}
			</div>
			<WeatherApiCredit />
		</section>
	)
}

export default DailyWeatherSection
