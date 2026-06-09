import {
	CurrentWeatherSection,
	DailyWeatherSection,
	HourlyWeatherSection,
	MoonriseMoonsetSection,
	SunriseSunsetSection,
	UvIndexSection,
	WeatherRadarSection
} from './sections'

function HomepageContainer() {
	return (
		<div className="flex gap-10">
			<div className="flex w-2/3 flex-col gap-6">
				<CurrentWeatherSection />
				<HourlyWeatherSection />
				<DailyWeatherSection />
			</div>
			<div className="flex w-1/3 flex-col gap-6">
				<section>검색</section>
				<UvIndexSection />
				<SunriseSunsetSection />
				<MoonriseMoonsetSection />
				<WeatherRadarSection />
			</div>
		</div>
	)
}

export default HomepageContainer
