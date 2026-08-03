import type { WeatherApiLocation } from '@/types/weather-api.type'

/** WeatherAPI location 필드 중 라벨 표시에 필요한 필드만 사용합니다. */
type WeatherLocationLabelSource = Pick<WeatherApiLocation, 'name' | 'region'>

/**
 * WeatherAPI location → 표시 라벨 (레거시).
 * 홈 CurrentLocation 라벨은 카카오 Local(검색·coord2address·쿠키)을 쓰므로
 * 새 화면 경로에서는 호출하지 않습니다.
 */
function formatWeatherLocationLabel(location: WeatherLocationLabelSource): string {
	const { region, name } = location
	const label = [region, name].filter(Boolean).join(' ').trim()

	return label || name
}

export { formatWeatherLocationLabel }
