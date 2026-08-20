import type { BaseballPark, BaseballParkMapFilter } from '@/features/theme-maps/lib/baseball-parks'
import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

/** 야구장명·홈팀·단위 설정 헤더 */
type BaseballHeadingProps = {
	park: BaseballPark
	error: AppApiError | null
}

/** 야구장 헤더 + 실시간 날씨 조합 */
type BaseballCurrentWeatherSectionProps = BaseballHeadingProps & CurrentWeatherProps

/** 야구장 상세 client 조합기 초기 props */
type BaseballDetailClientProps = {
	park: BaseballPark
	initialFilter: BaseballParkMapFilter
	initialWeather: WeatherSummary | null
	initialUnits: WeatherUnits | null
	initialError: AppApiError | null
}

/** 다른 야구장 보기(접이식 목록) */
type BaseballPickerSectionProps = {
	selectedParkId: string
	initialFilter: BaseballParkMapFilter
}

export type {
	BaseballCurrentWeatherSectionProps,
	BaseballDetailClientProps,
	BaseballHeadingProps,
	BaseballPickerSectionProps
}
