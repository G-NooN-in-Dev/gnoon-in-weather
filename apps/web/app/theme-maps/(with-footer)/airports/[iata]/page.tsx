import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import AirportDetailContentServer from '@/app/theme-maps/(with-footer)/airports/[iata]/_components/airport-detail-content.server'
import { ThemeMapsDetailSkeleton } from '@/components/skeletons/page-skeletons'
import { getAirportByIata } from '@/features/theme-maps/lib/airports'
import type { ThemeMapsAirportDetailPageProps } from '@/features/theme-maps/types/theme-maps-component.type'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'

async function ThemeMapsAirportDetailPage({ params }: ThemeMapsAirportDetailPageProps) {
	const { iata } = await params
	const airport = getAirportByIata(iata)

	if (!airport) {
		notFound()
	}

	const initialUnits = await readWeatherUnitsFromCookies()

	return (
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<Suspense fallback={<ThemeMapsDetailSkeleton />}>
				<AirportDetailContentServer airport={airport} initialUnits={initialUnits} />
			</Suspense>
		</div>
	)
}

export default ThemeMapsAirportDetailPage
