'use client'

import { useState } from 'react'

import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import { AirportsMapSection } from '@/features/theme-maps/sections'
import type { AirportsClientProps } from '@/features/theme-maps/types/theme-maps-component.type'

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
