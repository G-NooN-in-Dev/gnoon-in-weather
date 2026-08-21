'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import ThemeMapFilterTabs from '@/features/theme-maps/components/theme-map-filter-tabs'
import {
	BASEBALL_PARK_MAP_FILTER_OPTIONS,
	BASEBALL_PARKS,
	type BaseballParkMapFilter,
	isBaseballParkVisibleForFilter
} from '@/features/theme-maps/lib/baseball-parks'
import { THEME_MAPS_ROUTES } from '@/features/theme-maps/lib/theme-maps-routes'
import type { BaseballPickerSectionProps } from '@/features/theme-maps/types/baseball-detail-component.type'

/**
 * 야구장 상세 우측의 다른 야구장 보기 섹션.
 * 접이식 2열 목록으로 구장을 고르고, 1군·2군 탭으로 필터합니다.
 */
function BaseballPickerSection({ selectedParkId, initialFilter }: BaseballPickerSectionProps) {
	const [open, setOpen] = useState(true)
	const [filter, setFilter] = useState<BaseballParkMapFilter>(initialFilter)

	const parks = useMemo(() => BASEBALL_PARKS.filter((park) => isBaseballParkVisibleForFilter(park, filter)), [filter])

	return (
		<section>
			<Card className="gap-3 py-4">
				<Collapsible open={open} onOpenChange={setOpen}>
					<CardHeader>
						<CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left outline-none">
							<CardTitle className="text-xl font-bold">다른 야구장 보기</CardTitle>
							{open ? (
								<ChevronUpIcon className="text-muted-foreground size-5 shrink-0" aria-hidden />
							) : (
								<ChevronDownIcon className="text-muted-foreground size-5 shrink-0" aria-hidden />
							)}
						</CollapsibleTrigger>
					</CardHeader>
					<CollapsibleContent>
						<CardContent className="flex flex-col gap-3 pt-3">
							<ThemeMapFilterTabs
								value={filter}
								options={BASEBALL_PARK_MAP_FILTER_OPTIONS}
								onValueChange={setFilter}
								ariaLabel="구장 구분"
								className="w-full"
								listClassName="w-full"
							/>
							<ul className="grid grid-cols-2 gap-x-3 gap-y-2">
								{parks.map((park) => {
									const selected = park.id === selectedParkId

									return (
										<li key={park.id} className="min-w-0">
											{selected ? (
												<span
													className="text-pastel-green-700 block truncate text-sm font-medium"
													title={park.name}
													aria-current="page"
												>
													{park.name}
												</span>
											) : (
												<Link
													href={THEME_MAPS_ROUTES.baseballDetail(park.id, filter)}
													className="text-foreground/80 hover:text-foreground block truncate text-sm transition-colors"
													title={park.name}
												>
													{park.name}
												</Link>
											)}
										</li>
									)
								})}
							</ul>
						</CardContent>
					</CollapsibleContent>
				</Collapsible>
			</Card>
		</section>
	)
}

export default BaseballPickerSection
