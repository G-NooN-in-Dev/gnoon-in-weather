'use client'

import { useState } from 'react'

import BaseballInfoPanel from '@/features/theme-maps/components/baseball-info-panel'
import BaseballKakaoMap from '@/features/theme-maps/components/baseball-kakao-map'
import ThemeMapFilterTabs from '@/features/theme-maps/components/theme-map-filter-tabs'
import {
	BASEBALL_PARK_MAP_FILTER_OPTIONS,
	type BaseballParkMapFilter,
	getBaseballParkById,
	isBaseballParkVisibleForFilter
} from '@/features/theme-maps/lib/baseball-parks'
import type { BaseballMapSectionProps } from '@/features/theme-maps/types/theme-maps-component.type'

function BaseballMapSection({ selectedParkId, onSelect, onClear }: BaseballMapSectionProps) {
	const [filter, setFilter] = useState<BaseballParkMapFilter>('first')
	const selectedPark = selectedParkId ? (getBaseballParkById(selectedParkId) ?? null) : null

	const handleFilterChange = (next: BaseballParkMapFilter) => {
		setFilter(next)
		if (selectedPark && !isBaseballParkVisibleForFilter(selectedPark, next)) {
			onClear()
		}
	}

	return (
		// 헤더 h-14(3.5rem) + lg에서 ThemeMapsNav h-12(3rem) → 6.5rem
		<section className="relative h-[calc(100dvh-3.5rem)] w-full lg:h-[calc(100dvh-6.5rem)]">
			<BaseballKakaoMap
				selectedParkId={selectedParkId}
				onSelect={onSelect}
				onClear={onClear}
				filter={filter}
				className="size-full"
				mapClassName="size-full rounded-none"
			/>
			<div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 p-3 sm:p-4">
				<div className="pointer-events-auto shrink-0">
					<ThemeMapFilterTabs
						value={filter}
						options={BASEBALL_PARK_MAP_FILTER_OPTIONS}
						onValueChange={handleFilterChange}
						ariaLabel="구장 구분"
						tone="baseball"
					/>
				</div>
				<div className="pointer-events-auto w-[min(100%,20rem)] min-w-0">
					<BaseballInfoPanel park={selectedPark} mapFilter={filter} onClose={onClear} />
				</div>
			</div>
		</section>
	)
}

export default BaseballMapSection
