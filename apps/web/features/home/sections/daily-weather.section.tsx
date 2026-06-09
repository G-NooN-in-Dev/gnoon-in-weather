import DailyWeatherCard from '../components/daily-weather-card'

function DailyWeatherSection() {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="pl-2 text-2xl font-bold">3일 예보</h2>
			<div className="grid grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, index) => {
					return <DailyWeatherCard key={index} />
				})}
			</div>
		</section>
	)
}

export default DailyWeatherSection
