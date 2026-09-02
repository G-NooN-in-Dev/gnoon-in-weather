import { Suspense } from 'react'

import MyPageGateServer from '@/app/(with-footer)/my/_components/my-page-gate.server'
import { MyPageSkeleton } from '@/components/skeletons/page-skeletons'

function MyPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<Suspense fallback={<MyPageSkeleton />}>
						<MyPageGateServer />
					</Suspense>
				</div>
			</main>
		</div>
	)
}

export default MyPage
