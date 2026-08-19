'use client'

import { useState } from 'react'

import { WeatherUnitsProvider } from '@/contexts/weather-units.context'
import BaseballMapSection from '@/features/theme-maps/sections/baseball-map.section'
import type { WeatherUnits } from '@/types/weather-units.type'

type BaseballClientProps = {
	initialUnits: WeatherUnits | null
}

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
