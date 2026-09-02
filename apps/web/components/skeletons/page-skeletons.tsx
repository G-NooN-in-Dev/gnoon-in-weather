import { Skeleton } from '@shared/ui/skeleton'

function TwoColumnPageSkeleton() {
	return (
		<div className="flex gap-10" aria-busy="true" aria-live="polite">
			<div className="flex w-2/3 flex-col gap-6">
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-48 w-full rounded-xl" />
			</div>
			<div className="flex w-1/3 flex-col gap-6">
				<Skeleton className="h-36 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</div>
	)
}

function HomePageSkeleton() {
	return <TwoColumnPageSkeleton />
}

function WeatherNewsPageSkeleton() {
	return (
		<div className="flex gap-10" aria-busy="true" aria-live="polite">
			<div className="flex w-2/3 flex-col gap-4">
				{Array.from({ length: 6 }).map((_, index) => (
					<Skeleton key={index} className="h-28 w-full rounded-xl" />
				))}
			</div>
			<aside className="w-1/3 shrink-0">
				<Skeleton className="h-128 w-full rounded-xl" />
			</aside>
		</div>
	)
}

function MyPageSkeleton() {
	return (
		<div className="mt-6 flex flex-col gap-10 px-4" aria-busy="true" aria-live="polite">
			<Skeleton className="h-40 w-full rounded-xl" />
			<Skeleton className="h-0.5 w-full" />
			<Skeleton className="h-48 w-full rounded-xl" />
			<Skeleton className="h-0.5 w-full" />
			<Skeleton className="h-32 w-full rounded-xl" />
			<Skeleton className="h-0.5 w-full" />
			<Skeleton className="h-32 w-full rounded-xl" />
		</div>
	)
}

function MyPageFavoriteLocationsSkeleton() {
	return <Skeleton className="h-40 w-full rounded-xl" aria-busy="true" aria-live="polite" />
}

function MyPageFavoritePressListsSkeleton() {
	return <Skeleton className="h-48 w-full rounded-xl" aria-busy="true" aria-live="polite" />
}

function MyPageAccountDeleteSkeleton() {
	return <Skeleton className="h-32 w-full rounded-xl" aria-busy="true" aria-live="polite" />
}

function ThemeMapsHomeSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-busy="true" aria-live="polite">
			<Skeleton className="h-48 w-full rounded-xl" />
			<Skeleton className="h-48 w-full rounded-xl" />
		</div>
	)
}

function ThemeMapsDetailSkeleton() {
	return <TwoColumnPageSkeleton />
}

function ThemeMapsListSkeleton() {
	return (
		<div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
			<Skeleton className="h-12 w-full max-w-md rounded-lg" />
			<Skeleton className="h-112 w-full rounded-xl" />
		</div>
	)
}

export {
	HomePageSkeleton,
	MyPageAccountDeleteSkeleton,
	MyPageFavoriteLocationsSkeleton,
	MyPageFavoritePressListsSkeleton,
	MyPageSkeleton,
	ThemeMapsDetailSkeleton,
	ThemeMapsHomeSkeleton,
	ThemeMapsListSkeleton,
	TwoColumnPageSkeleton,
	WeatherNewsPageSkeleton
}
