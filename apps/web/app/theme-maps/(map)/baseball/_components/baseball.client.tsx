'use client'

import { useState } from 'react'

import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import { BaseballMapSection } from '@/features/theme-maps/sections'
import type { BaseballClientProps } from '@/features/theme-maps/types/theme-maps-component.type'

function BaseballClient({ initialUnits }: BaseballClientProps) {
	const [selectedParkId, setSelectedParkId] = useState<string | null>(null)

	return (
		<WeatherUnitsProvider initialUnits={initialUnits}>
			<BaseballMapSection
				selectedParkId={selectedParkId}
				onSelect={setSelectedParkId}
				onClear={() => setSelectedParkId(null)}
			/>
		</WeatherUnitsProvider>
	)
}

export default BaseballClient
