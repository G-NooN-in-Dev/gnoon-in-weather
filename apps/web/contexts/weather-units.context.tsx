import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

import { DEFAULT_WEATHER_UNITS } from '@/libs/weather-units'
import { WeatherUnits } from '@/types/weather-units.type'
import { readWeatherUnitsCookie, writeWeatherUnitsCookie } from '@/utils/weather-units-cookie'

type WeatherUnitsContextValue = {
	units: WeatherUnits
	applyUnits: (next: WeatherUnits) => void
}

const WeatherUnitsContext = createContext<WeatherUnitsContextValue | null>(null)

function WeatherUnitsProvider({ children }: PropsWithChildren) {
	// TODO - 쿠키에서 불러오기
	const [units, setUnits] = useState<WeatherUnits>(readWeatherUnitsCookie() ?? DEFAULT_WEATHER_UNITS)

	const applyUnits = useCallback((next: WeatherUnits) => {
		setUnits(next)
		writeWeatherUnitsCookie(next)
	}, [])

	const weatherUnitsValue = useMemo(() => ({ units, applyUnits }), [units, applyUnits])

	return <WeatherUnitsContext.Provider value={weatherUnitsValue}>{children}</WeatherUnitsContext.Provider>
}

function useWeatherUnits() {
	const weatherUnitsContext = useContext(WeatherUnitsContext)

	if (!weatherUnitsContext) {
		throw new Error('useWeatherUnits는 WeatherUnitsProvider 내부에서만 사용할 수 있습니다.')
	}

	return weatherUnitsContext
}

export { useWeatherUnits, WeatherUnitsProvider }
