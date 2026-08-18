'use client'

import usePlaceRealtimeWeather from '@/features/theme-maps/hooks/use-place-realtime-weather'
import type { Airport } from '@/features/theme-maps/lib/airports'
import type { AppApiError } from '@/types/error.type'
import type { WeatherApiRealtimeResponse } from '@/types/weather-api.type'

type UseAirportRealtimeWeatherResult = {
	realtimeWeather: WeatherApiRealtimeResponse | null
	loading: boolean
	error: AppApiError | null
}

/**
 * 선택한 공항 좌표로 `/api/weather/realtime`만 조회합니다.
 * 공통 장소 훅에 IATA를 id로 넘깁니다.
 */
function useAirportRealtimeWeather(airport: Airport): UseAirportRealtimeWeatherResult {
	const { iata, lat, lng } = airport

	return usePlaceRealtimeWeather({ id: iata, lat, lng })
}

export default useAirportRealtimeWeather
