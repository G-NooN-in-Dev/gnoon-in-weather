import { SearchX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import DailyWeatherCard from '@/features/weather/components/daily-weather-card'
import type { ForecastDaysSectionProps } from '@/features/weather/types/weather-component.type'

import WeatherApiCredit from '../components/weather-api-credit'

function DailyWeatherSection({ days }: ForecastDaysSectionProps) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="pl-2 text-xl font-bold md:text-2xl">3일 예보</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
				{days.length > 0 ? (
					days.map((day, index) => (
						<div key={day.date_epoch} className={index === 0 ? 'col-span-2 md:col-span-1' : undefined}>
							<DailyWeatherCard day={day} dayIndex={index} />
						</div>
					))
				) : (
					<EmptyState
						className="col-span-2 md:col-span-3"
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
