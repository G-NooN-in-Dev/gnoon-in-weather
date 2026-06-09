import CurrentLocation from '../components/current-location'
import CurrentWeather from '../components/current-weather'

function CurrentWeatherSection() {
	return (
		<section className="flex flex-col gap-3">
			<CurrentLocation />
			<CurrentWeather />
		</section>
	)
}

export default CurrentWeatherSection
