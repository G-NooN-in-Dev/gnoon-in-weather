import { ThemeMapsDetailSkeleton } from '@/components/skeletons/page-skeletons'

function ThemeMapsBaseballDetailLoading() {
	return (
		<div className="max-w-content container mx-auto flex w-full flex-col py-8">
			<ThemeMapsDetailSkeleton />
		</div>
	)
}

export default ThemeMapsBaseballDetailLoading
