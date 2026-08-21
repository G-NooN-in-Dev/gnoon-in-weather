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

/* eslint-disable no-unused-vars -- 콜백 시그니처의 파라미터명은 문서용입니다. */
type BaseballParkSelectHandler = (id: string) => void
/* eslint-enable no-unused-vars */

type BaseballMapSectionProps = {
	selectedParkId: string | null
	onSelect: BaseballParkSelectHandler
	onClear: () => void
}

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
		<section className="relative h-[calc(100dvh-6.5rem)] w-full">
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
