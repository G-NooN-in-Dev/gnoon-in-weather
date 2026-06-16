import type { CurrentWeatherSectionProps } from '@/features/home/types/home-component.type'

import CurrentLocation from '../components/current-location'
import CurrentWeather from '../components/current-weather'

function CurrentWeatherSection({
	current,
	location,
	loading,
	isLocating,
	error,
	onRequestCurrentPosition
}: CurrentWeatherSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<CurrentLocation
				location={location}
				loading={loading}
				isLocating={isLocating}
				error={error}
				onRequestCurrentPosition={onRequestCurrentPosition}
			/>
			<CurrentWeather current={current} />
		</section>
	)
}

export default CurrentWeatherSection
