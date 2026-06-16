import type { WeatherApiLocation } from '@/types/weather-api.type'

/** WeatherAPI location 필드 중 라벨 표시에 필요한 필드만 사용합니다. */
type WeatherLocationLabelSource = Pick<WeatherApiLocation, 'name' | 'region'>

// FIXME - 추후 카카오 로컬 API 를 활용하여 label 변경 예정
/** WeatherAPI location 필드를 화면 표시용 라벨로 변환합니다. */
function formatWeatherLocationLabel(location: WeatherLocationLabelSource): string {
	const { region, name } = location
	const label = [region, name].filter(Boolean).join(' ').trim()

	return label || name
}

export { formatWeatherLocationLabel }
