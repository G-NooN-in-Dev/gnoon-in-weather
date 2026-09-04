import { Skeleton } from '@shared/ui/skeleton'

/**
 * 홈: 모바일은 검색이 본문 상단, lg+는 aside 상단 (LocationSearch 배치와 동일).
 * 레이아웃은 모바일 1열 스택 / lg+ 좌 2/3 · 우 1/3.
 */
function HomePageSkeleton() {
	return (
		<div
			className="flex flex-col gap-6 px-6 md:px-8 lg:flex-row lg:gap-10 lg:px-10"
			aria-busy="true"
			aria-live="polite"
		>
			<div className="flex flex-col gap-6 lg:w-2/3">
				<Skeleton className="h-10 w-full rounded-lg lg:hidden" />
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-48 w-full rounded-xl" />
			</div>
			<div className="flex flex-col gap-6 lg:w-1/3">
				<Skeleton className="hidden h-10 w-full rounded-lg lg:block" />
				<Skeleton className="h-36 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</div>
	)
}

/**
 * 날씨 뉴스: 모바일은 피드 전폭(+필터 버튼 자리) / lg+는 우측 언론사 필터.
 */
function WeatherNewsPageSkeleton() {
	return (
		<div className="flex flex-col gap-10 px-6 md:px-8 lg:flex-row lg:px-10" aria-busy="true" aria-live="polite">
			<div className="flex w-full flex-col lg:w-2/3">
				<div className="mb-4 flex items-center justify-between gap-3">
					<Skeleton className="h-5 w-24 rounded-md" />
					<Skeleton className="h-8 w-20 rounded-md lg:hidden" />
				</div>
				<div className="flex flex-col gap-4">
					{Array.from({ length: 6 }).map((_, index) => (
						<Skeleton key={index} className="h-28 w-full rounded-xl" />
					))}
				</div>
			</div>
			<aside className="hidden w-1/3 shrink-0 lg:block">
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

/**
 * 공항·야구장 상세: 모바일 1열 스택 / lg+ 좌 2/3 · 우 1/3.
 */
function ThemeMapsDetailSkeleton() {
	return (
		<div
			className="flex flex-col gap-6 px-6 md:px-8 lg:flex-row lg:gap-10 lg:px-10"
			aria-busy="true"
			aria-live="polite"
		>
			<div className="flex flex-col gap-6 lg:w-2/3">
				<Skeleton className="h-56 w-full rounded-xl" />
				<Skeleton className="h-40 w-full rounded-xl" />
				<Skeleton className="h-48 w-full rounded-xl" />
			</div>
			<div className="flex flex-col gap-6 lg:w-1/3">
				<Skeleton className="h-36 w-full rounded-xl" />
				<Skeleton className="h-28 w-full rounded-xl" />
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</div>
	)
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
	WeatherNewsPageSkeleton
}
