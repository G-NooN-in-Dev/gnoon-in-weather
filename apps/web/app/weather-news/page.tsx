import { Suspense } from 'react'

import WeatherNewsContentServer from '@/app/weather-news/_components/weather-news-content.server'
import { WeatherNewsPageSkeleton } from '@/components/skeletons/page-skeletons'

function WeatherNewsPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<Suspense fallback={<WeatherNewsPageSkeleton />}>
						<WeatherNewsContentServer />
					</Suspense>
				</div>
			</main>
		</div>
	)
}

export default WeatherNewsPage
