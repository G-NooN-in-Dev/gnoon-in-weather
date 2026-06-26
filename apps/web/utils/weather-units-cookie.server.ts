import { cookies } from 'next/headers'

import { WEATHER_UNITS_COOKIE_NAME } from '@/libs/weather-units'
import type { WeatherUnits } from '@/types/weather-units.type'
import { parseWeatherUnitsCookie } from '@/utils/weather-units-cookie'

/** 서버에서 저장된 단위 설정 쿠키를 읽습니다. (SSR 첫 렌더와 클라이언트 hydration 값 일치용) */
async function readWeatherUnitsFromCookies(): Promise<WeatherUnits | null> {
	const cookieStore = await cookies()
	const raw = cookieStore.get(WEATHER_UNITS_COOKIE_NAME)?.value

	return raw ? parseWeatherUnitsCookie(decodeURIComponent(raw)) : null
}

export { readWeatherUnitsFromCookies }
