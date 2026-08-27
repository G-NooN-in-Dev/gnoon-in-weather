import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import type { AppApiError } from '@/types/error.type'
import type { WeatherNewsFeedPage, WeatherNewsListItem } from '@/types/naver-news.type'

type WeatherNewsClientProps = {
	initialPage: WeatherNewsFeedPage | null
	initialError: AppApiError | null
}

type NewsFeedSectionProps = {
	items: WeatherNewsListItem[]
	/** 필터 적용 전, 지금까지 불러온 전체 기사 수 */
	loadedCount: number
	/** 언론사 필터가 하나라도 적용 중인지 */
	isFiltered: boolean
	hasMore: boolean
	loadingMore: boolean
	errorMessage: string | null
	onLoadMore: () => void
}

type NewsListItemProps = {
	item: WeatherNewsListItem
}

type PressFilterSectionProps = {
	selectedPresses: PressEntry[]
	maxSelection: number
	onToggle: (press: PressEntry) => void
	onRemove: (domain: string) => void
	onReset: () => void
}

export type { NewsFeedSectionProps, NewsListItemProps, PressFilterSectionProps, WeatherNewsClientProps }
