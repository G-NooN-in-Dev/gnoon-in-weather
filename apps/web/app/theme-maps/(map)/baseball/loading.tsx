import { ThemeMapsListSkeleton } from '@/components/skeletons/page-skeletons'

function ThemeMapsBaseballLoading() {
	return (
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<ThemeMapsListSkeleton />
		</div>
	)
}

export default ThemeMapsBaseballLoading
