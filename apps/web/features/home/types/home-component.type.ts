import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'
import type { AppApiError } from '@/types/error.type'
import type { LocationState } from '@/types/location.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

/** 위치 표시·GPS 버튼에 공통으로 쓰는 props (홈 전용) */
type LocationControlProps = {
	location: LocationState
	loading: boolean
	isLocating: boolean
	error: AppApiError | null
	onRequestCurrentPosition: () => void
}

/** CurrentWeatherSection — GPS 위치 UI + 실시간 날씨 조합 */
type CurrentWeatherSectionProps = LocationControlProps & CurrentWeatherProps

/** 홈 client 조합기 초기 props */
type HomepageClientProps = {
	initialLocation: LocationState
	initialWeather: WeatherSummary | null
	initialUnits: WeatherUnits | null
	initialError: AppApiError | null
}

export type { CurrentWeatherSectionProps, HomepageClientProps, LocationControlProps }
