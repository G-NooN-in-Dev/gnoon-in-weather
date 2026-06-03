import CurrentLocation from './current-location'

function CurrentWeatherSection() {
	return (
		<section className="flex flex-col">
			<CurrentLocation />
			<div>실시간 날씨 섹션</div>
		</section>
	)
}

export default CurrentWeatherSection
