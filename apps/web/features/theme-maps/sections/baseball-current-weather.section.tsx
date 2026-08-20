import CurrentWeather from '@/features/weather/components/current-weather'

import BaseballHeading from '../components/baseball-heading'
import type { BaseballCurrentWeatherSectionProps } from '../types/baseball-detail-component.type'

function BaseballCurrentWeatherSection({ park, current, error }: BaseballCurrentWeatherSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<BaseballHeading park={park} error={error} />
			<CurrentWeather current={current} />
		</section>
	)
}

export default BaseballCurrentWeatherSection
