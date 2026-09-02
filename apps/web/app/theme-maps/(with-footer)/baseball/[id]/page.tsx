import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import BaseballDetailContentServer from '@/app/theme-maps/(with-footer)/baseball/[id]/_components/baseball-detail-content.server'
import { ThemeMapsDetailSkeleton } from '@/components/skeletons/page-skeletons'
import {
	getBaseballParkById,
	parseBaseballParkMapFilter,
	resolveBaseballParkMapFilter
} from '@/features/theme-maps/lib/baseball-parks'
import type { ThemeMapsBaseballDetailPageProps } from '@/features/theme-maps/types/theme-maps-component.type'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'

async function ThemeMapsBaseballDetailPage({ params, searchParams }: ThemeMapsBaseballDetailPageProps) {
	const { id } = await params
	const { level } = await searchParams
	const park = getBaseballParkById(id)

	if (!park) {
		notFound()
	}

	const initialFilter = resolveBaseballParkMapFilter(park, parseBaseballParkMapFilter(level))
	const initialUnits = await readWeatherUnitsFromCookies()

	return (
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<Suspense fallback={<ThemeMapsDetailSkeleton />}>
				<BaseballDetailContentServer park={park} initialFilter={initialFilter} initialUnits={initialUnits} />
			</Suspense>
		</div>
	)
}

export default ThemeMapsBaseballDetailPage
