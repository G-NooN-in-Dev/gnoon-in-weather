import { ThemeMapsListSkeleton } from '@/components/skeletons/page-skeletons'

function ThemeMapsAirportsLoading() {
	return (
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<ThemeMapsListSkeleton />
		</div>
	)
}

export default ThemeMapsAirportsLoading
