import CurrentWeather from '@/features/weather/components/current-weather'

import AirportHeading from '../components/airport-heading'
import type { AirportCurrentWeatherSectionProps } from '../types/airport-detail-component.type'

function AirportCurrentWeatherSection({ airport, current, error }: AirportCurrentWeatherSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<AirportHeading airport={airport} error={error} />
			<CurrentWeather current={current} />
		</section>
	)
}

export default AirportCurrentWeatherSection
