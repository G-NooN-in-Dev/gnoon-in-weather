import type { Airport } from '@/features/theme-maps/lib/airports'
import type { CurrentWeatherProps } from '@/features/weather/types/weather-component.type'
import type { AppApiError } from '@/types/error.type'
import type { WeatherSummary } from '@/types/weather-api.type'
import type { WeatherUnits } from '@/types/weather-units.type'

/** 공항명·IATA·단위 설정 헤더 */
type AirportHeadingProps = {
	airport: Airport
	error: AppApiError | null
}

/** 공항 헤더 + 실시간 날씨 조합 */
type AirportCurrentWeatherSectionProps = AirportHeadingProps & CurrentWeatherProps

/** 공항 상세 client 조합기 초기 props */
type AirportDetailClientProps = {
	airport: Airport
	initialWeather: WeatherSummary | null
	initialUnits: WeatherUnits | null
	initialError: AppApiError | null
}

export type { AirportCurrentWeatherSectionProps, AirportDetailClientProps, AirportHeadingProps }
