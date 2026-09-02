import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import type { AppApiError } from '@/types/error.type'
import type { FavoritePressList } from '@/types/favorite-press-list.type'
import type { WeatherNewsFeedPage, WeatherNewsListItem } from '@/types/naver-news.type'

type WeatherNewsClientProps = {
	isLoggedIn: boolean
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

type PressFilterSectionProps = {
	isLoggedIn: boolean
	favoriteLists: FavoritePressList[]
	appliedListId: string | null
	isFavoriteListsLoading: boolean
	selectedPresses: PressEntry[]
	maxSelection: number
	/** 선호목록 개수 한도 도달 등으로 추가 버튼이 비활성인지 */
	isAddDisabled: boolean
	isPending: boolean
	onToggle: (press: PressEntry) => void
	onRemove: (domain: string) => void
	onReset: () => void
	onAddClick: () => void
	onEditClick: () => void
	onApplyClick: (list: FavoritePressList) => void
}

export type { NewsFeedSectionProps, PressFilterSectionProps, WeatherNewsClientProps }
