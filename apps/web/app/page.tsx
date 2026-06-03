import HomepageContainer from '@/features/home/homepage-container'

export default function Homepage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					<HomepageContainer />
				</div>
			</main>
		</div>
	)
}
