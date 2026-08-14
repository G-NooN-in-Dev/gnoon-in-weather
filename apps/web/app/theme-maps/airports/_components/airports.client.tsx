'use client'

import { useState } from 'react'

import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import AirportsMapSection from '@/features/theme-maps/sections/airports-map.section'
import type { WeatherUnits } from '@/types/weather-units.type'

type AirportsClientProps = {
	initialUnits: WeatherUnits | null
}

function AirportsClient({ initialUnits }: AirportsClientProps) {
	const [selectedIata, setSelectedIata] = useState<string | null>(null)

	return (
		<WeatherUnitsProvider initialUnits={initialUnits}>
			<AirportsMapSection
				selectedIata={selectedIata}
				onSelect={setSelectedIata}
				onClear={() => setSelectedIata(null)}
			/>
		</WeatherUnitsProvider>
	)
}

export default AirportsClient
