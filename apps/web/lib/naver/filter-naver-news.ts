import { stripNaverHtml } from '@/lib/naver/strip-html'
import type { NaverNewsItem } from '@/types/naver-news.type'

import { pressList } from './broadcast-press-list'
import { WEATHER_NEWS_TOPIC_KEYWORDS } from './news-filter-keywords'

const isKeywordInText = (text: string, keywords: readonly string[]) =>
	keywords.some((keyword) => text.includes(keyword))

/**
 * 날씨 정보 기사만 남깁니다.
 * 제목에 ‘날씨’가 있어도 연예·급식 등 부수적 언급은 제외하고, 기상·예보·특보 등 주제 신호가 있는 항목만 통과시킵니다.
 */
function filterWeatherNewsItem(item: NaverNewsItem): boolean {
	const { originallink, title } = item

	const validPressList = pressList.some((list) => Object.keys(list).some((value) => originallink.includes(value)))

	if (!validPressList) {
		return false
	}

	if (isKeywordInText(stripNaverHtml(title), WEATHER_NEWS_TOPIC_KEYWORDS)) {
		return true
	}

	return false
}

export { filterWeatherNewsItem }
