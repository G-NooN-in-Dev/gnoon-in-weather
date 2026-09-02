import { Suspense } from 'react'

import HomepageWeatherServer from '@/app/_components/homepage-weather.server'
import { HomePageSkeleton } from '@/components/skeletons/page-skeletons'
import { getCurrentUser } from '@/lib/auth/session.server'
import { resolveHomeLocation } from '@/lib/location/resolve-home'
import { readWeatherUnitsFromCookies } from '@/lib/weather/units-cookie.server'
import { loadFavoriteLocations } from '@/services/favorite-location.loader'

async function Homepage() {
	const user = await getCurrentUser()
	const [baseLocation, initialUnits] = await Promise.all([resolveHomeLocation(), readWeatherUnitsFromCookies()])
	const initialFavoriteLocations = user ? await loadFavoriteLocations(user.id) : []

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<Suspense fallback={<HomePageSkeleton />}>
						<HomepageWeatherServer
							baseLocation={baseLocation}
							initialUnits={initialUnits}
							initialFavoriteLocations={initialFavoriteLocations}
							isLoggedIn={user !== null}
						/>
					</Suspense>
				</div>
			</main>
		</div>
	)
}

export default Homepage
