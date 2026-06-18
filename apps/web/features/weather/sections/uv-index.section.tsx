import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'

function UvIndexSection({ current }: CurrentWeatherProps) {
	return (
		<section>
			<h2>자외선 정보</h2>
			{current ? <p className="text-grayscale-600 text-sm">오늘 자외선 지수: {current.uv}</p> : null}
		</section>
	)
}

export default UvIndexSection
