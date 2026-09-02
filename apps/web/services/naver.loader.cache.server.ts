import { cacheLife, cacheTag } from 'next/cache'

import { NAVER_NEWS_REVALIDATE_SECONDS } from '@/lib/naver/constants'
import { loadWeatherNews } from '@/services/naver.loader'
import type { WeatherNewsFeedPage } from '@/types/naver-news.type'

/** SSR 첫 페이지용 — 동일 검색어·커서 없음 결과를 Cache Components로 공유합니다. */
async function loadWeatherNewsFirstPage(): Promise<WeatherNewsFeedPage> {
	'use cache'
	cacheTag('weather-news')
	cacheLife({ revalidate: NAVER_NEWS_REVALIDATE_SECONDS })

	return loadWeatherNews()
}

export { loadWeatherNewsFirstPage }
