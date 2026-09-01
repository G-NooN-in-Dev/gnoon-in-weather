import CurrentLocation from '@/features/home/components/current-location'
import type { CurrentWeatherSectionProps } from '@/features/home/types/home-component.type'
import CurrentWeather from '@/features/weather/components/current-weather'

function CurrentWeatherSection({
	current,
	location,
	loading,
	isLocating,
	error,
	onRequestCurrentPosition,
	isFavorite,
	isFavoritePending,
	onToggleFavorite
}: CurrentWeatherSectionProps) {
	return (
		<section className="flex flex-col gap-3">
			<CurrentLocation
				location={location}
				loading={loading}
				isLocating={isLocating}
				error={error}
				onRequestCurrentPosition={onRequestCurrentPosition}
				isFavorite={isFavorite}
				isFavoritePending={isFavoritePending}
				onToggleFavorite={onToggleFavorite}
			/>
			<CurrentWeather current={current} />
		</section>
	)
}

export default CurrentWeatherSection
