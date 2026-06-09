import CurrentLocation from './current-location'
import CurrentWeather from './current-weather'

function CurrentWeatherSection() {
	return (
		<section className="flex flex-col gap-3">
			<CurrentLocation />
			<CurrentWeather />
		</section>
	)
}

export default CurrentWeatherSection
