'use client'

import { useWeatherNews } from '@/features/weather-news/hooks/use-weather-news'
import NewsFeedSection from '@/features/weather-news/sections/news-feed.section'
import type { WeatherNewsClientProps } from '@/features/weather-news/types/weather-news-component.type'

/**
 * 날씨 뉴스 페이지 client 조합기.
 */
function WeatherNewsClient({ initialPage, initialError }: WeatherNewsClientProps) {
	const { items, hasMore, loadingMore, error, loadMore } = useWeatherNews({
		initialPage,
		initialError
	})

	return (
		<div className="flex gap-10">
			<div className="flex w-2/3 flex-col">
				<NewsFeedSection
					items={items}
					hasMore={hasMore}
					loadingMore={loadingMore}
					errorMessage={error?.message || null}
					onLoadMore={loadMore}
				/>
			</div>
			<aside className="w-1/3"></aside>
		</div>
	)
}

export default WeatherNewsClient
