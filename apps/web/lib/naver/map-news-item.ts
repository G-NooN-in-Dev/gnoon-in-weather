import { stripNaverHtml } from '@/lib/naver/strip-html'
import type { NaverNewsItem, WeatherNewsListItem } from '@/types/naver-news.type'

import { resolvePressName } from './broadcast-press-list'

/** 네이버 원본 아이템을 화면용 리스트 아이템으로 변환합니다. */
function mapNaverNewsItem(item: NaverNewsItem): WeatherNewsListItem {
	const { title, description, originallink, link, pubDate } = item

	return {
		id: originallink || link,
		title: stripNaverHtml(title),
		description: stripNaverHtml(description),
		pressName: resolvePressName(originallink),
		pubDate,
		link,
		originallink
	}
}

export { mapNaverNewsItem }
