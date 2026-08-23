import {
	NAVER_NEWS_FETCH_BATCH,
	NAVER_NEWS_SORT,
	NAVER_NEWS_START_MAX,
	NAVER_WEATHER_NEWS_QUERY,
	WEATHER_NEWS_PAGE_SIZE
} from '@/lib/naver/constants'
import { createNewsNextCursor, parseNewsCursor } from '@/lib/naver/cursor'
import { filterWeatherNewsItem } from '@/lib/naver/filter-naver-news'
import { mapNaverNewsItem } from '@/lib/naver/map-news-item'
import { getNewsSearch } from '@/services/naver.service'
import type { WeatherNewsFeedPage, WeatherNewsListItem } from '@/types/naver-news.type'

type LoadWeatherNewsOptions = {
	/** 다음 페이지 커서. 없으면 첫 페이지(start=1) */
	cursor?: string | null
	query?: string
	/** 네이버 API 1회 요청당 원본 개수 */
	fetchBatch?: number
}

/** 중복 id 없이 필터링된 뉴스를 누적합니다. */
function appendNewsItems(target: WeatherNewsListItem[], incoming: WeatherNewsListItem[]): void {
	const seen = new Set(target.map((item) => item.id))

	for (const item of incoming) {
		if (seen.has(item.id)) {
			continue
		}

		target.push(item)
		seen.add(item.id)
	}
}

/**
 * 날씨 관련 네이버 뉴스를 조회합니다. (더 보기용 nextCursor 포함)
 * 기상·예보 등 날씨 정보 기사만 남기고, 한 페이지당 최대 6건을 최신순(pubDate)으로 반환합니다.
 * 6건이 모일 때까지 네이버 API를 추가 호출하며, 남은 항목은 nextCursor 버퍼에 담습니다.
 * page·route는 service를 직접 부르지 않고 이 loader를 사용합니다.
 */
async function loadWeatherNews(options?: LoadWeatherNewsOptions): Promise<WeatherNewsFeedPage> {
	const query = options?.query ?? NAVER_WEATHER_NEWS_QUERY
	const fetchBatch = options?.fetchBatch ?? NAVER_NEWS_FETCH_BATCH
	const { start, buffer } = parseNewsCursor(options?.cursor)

	const collected: WeatherNewsListItem[] = [...buffer]
	let currentStart = start
	let total = Number.POSITIVE_INFINITY

	while (collected.length < WEATHER_NEWS_PAGE_SIZE) {
		if (currentStart > NAVER_NEWS_START_MAX) {
			break
		}

		const response = await getNewsSearch({
			query,
			display: fetchBatch,
			start: currentStart,
			sort: NAVER_NEWS_SORT
		})

		total = response.total

		if (response.items.length === 0) {
			break
		}

		const filteredItems = response.items.filter(filterWeatherNewsItem).map(mapNaverNewsItem)

		appendNewsItems(collected, filteredItems)
		currentStart = response.start + response.display

		if (currentStart > total) {
			break
		}
	}

	collected.sort((left, right) => Date.parse(right.pubDate) - Date.parse(left.pubDate))

	const items = collected.slice(0, WEATHER_NEWS_PAGE_SIZE)
	const overflow = collected.slice(WEATHER_NEWS_PAGE_SIZE)

	return {
		items,
		nextCursor: createNewsNextCursor(currentStart, overflow, total)
	}
}

export { loadWeatherNews }
export type { LoadWeatherNewsOptions }
