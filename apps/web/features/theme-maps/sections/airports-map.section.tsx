'use client'

import { useState } from 'react'

import AirportInfoPanel from '@/features/theme-maps/components/airport-info-panel'
import AirportsKakaoMap from '@/features/theme-maps/components/airports-kakao-map'
import ThemeMapFilterTabs from '@/features/theme-maps/components/theme-map-filter-tabs'
import {
	AIRPORT_MAP_FILTER_OPTIONS,
	type AirportMapFilter,
	getAirportByIata,
	isAirportVisibleForFilter
} from '@/features/theme-maps/lib/airports'
import type { AirportsMapSectionProps } from '@/features/theme-maps/types/theme-maps-component.type'

function AirportsMapSection({ selectedIata, onSelect, onClear }: AirportsMapSectionProps) {
	const [filter, setFilter] = useState<AirportMapFilter>('all')
	const selectedAirport = selectedIata ? (getAirportByIata(selectedIata) ?? null) : null

	const handleFilterChange = (next: AirportMapFilter) => {
		setFilter(next)
		if (selectedAirport && !isAirportVisibleForFilter(selectedAirport, next)) {
			onClear()
		}
	}

	return (
		// 헤더 h-14(3.5rem) + lg에서 ThemeMapsNav h-12(3rem) → 6.5rem
		<section className="relative h-[calc(100dvh-3.5rem)] w-full lg:h-[calc(100dvh-6.5rem)]">
			<AirportsKakaoMap
				selectedIata={selectedIata}
				onSelect={onSelect}
				onClear={onClear}
				internationalOnly={filter === 'international'}
				className="size-full"
				mapClassName="size-full rounded-none"
			/>
			<div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 p-3 sm:p-4">
				<div className="pointer-events-auto shrink-0">
					<ThemeMapFilterTabs
						value={filter}
						options={AIRPORT_MAP_FILTER_OPTIONS}
						onValueChange={handleFilterChange}
						ariaLabel="공항 구분"
						tone="airport"
					/>
				</div>
				<div className="pointer-events-auto w-[min(100%,20rem)] min-w-0">
					<AirportInfoPanel airport={selectedAirport} onClose={onClear} />
				</div>
			</div>
		</section>
	)
}

export default AirportsMapSection
