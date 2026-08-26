import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage, WeatherNewsListItem } from '@/types/naver-news.type'

type WeatherNewsClientProps = {
	initialPage: WeatherNewsFeedPage | null
	initialError: AppApiError | null
}

type NewsFeedSectionProps = {
	items: WeatherNewsListItem[]
	hasMore: boolean
	loadingMore: boolean
	errorMessage: string | null
	onLoadMore: () => void
}

type NewsListItemProps = {
	item: WeatherNewsListItem
}

export type { NewsFeedSectionProps, NewsListItemProps, WeatherNewsClientProps }
