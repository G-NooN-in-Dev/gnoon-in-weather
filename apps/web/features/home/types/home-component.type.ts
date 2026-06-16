import type { AppApiError } from '@/types/error.type'
import type { LocationState } from '@/types/location.type'
import type {
	ForecastAstroEntry,
	ForecastDayEntry,
	WeatherApiCurrent,
	WeatherApiHour,
	WeatherSummary
} from '@/types/weather-api.type'

/** 위치 표시·GPS 버튼에 공통으로 쓰는 props */
type LocationControlProps = {
	location: LocationState
	loading: boolean
	isLocating: boolean
	error: AppApiError | null
	onRequestCurrentPosition: () => void
}

/** 실시간 날씨 카드 props */
type CurrentWeatherProps = {
	current: WeatherApiCurrent | null
}

/** CurrentWeatherSection — 위치 UI + 실시간 날씨 */
type CurrentWeatherSectionProps = LocationControlProps & CurrentWeatherProps

/** 일별 예보 섹션 공통 props */
type ForecastDaysSectionProps = {
	days: ForecastDayEntry[]
}

/** 시간별 예보 섹션 props */
type ForecastHoursSectionProps = {
	hours: WeatherApiHour[]
}

/** 일출/월출 등 천체 일정 섹션 공통 props */
type ForecastAstroSectionProps = {
	astros: ForecastAstroEntry[]
}

/** 홈 client 조합기 초기 props */
type HomepageClientProps = {
	initialLocation: LocationState
	initialWeather: WeatherSummary | null
	initialError: AppApiError | null
}

export type {
	CurrentWeatherProps,
	CurrentWeatherSectionProps,
	ForecastAstroSectionProps,
	ForecastDaysSectionProps,
	ForecastHoursSectionProps,
	HomepageClientProps,
	LocationControlProps
}
