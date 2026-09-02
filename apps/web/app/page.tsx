import { Suspense } from 'react'

import HomepageContentServer from '@/app/_components/homepage-content.server'
import { HomePageSkeleton } from '@/components/skeletons/page-skeletons'

function Homepage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<Suspense fallback={<HomePageSkeleton />}>
						<HomepageContentServer />
					</Suspense>
				</div>
			</main>
		</div>
	)
}

export default Homepage
