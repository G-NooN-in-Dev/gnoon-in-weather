'use client'

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

import { DEFAULT_WEATHER_UNITS } from '@/lib/weather/units'
import { writeWeatherUnitsCookie } from '@/lib/weather/units-cookie'
import { WeatherUnits } from '@/types/weather-units.type'

type WeatherUnitsContextValue = {
	units: WeatherUnits
	applyUnits: (next: WeatherUnits) => void
}

type WeatherUnitsProviderProps = PropsWithChildren<{
	initialUnits?: WeatherUnits | null
}>

const WeatherUnitsContext = createContext<WeatherUnitsContextValue | null>(null)

function WeatherUnitsProvider({ children, initialUnits }: WeatherUnitsProviderProps) {
	const [units, setUnits] = useState<WeatherUnits>(initialUnits ?? DEFAULT_WEATHER_UNITS)

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
