'use client'

import useIsClient from '@/hooks/use-is-client'
import type { WeatherNewsListItem } from '@/types/naver-news.type'
import { formatNewsPubDateLabel, formatRelativeTime } from '@/utils/format'

type NewsListItemProps = {
	item: WeatherNewsListItem
}

/**
 * 뉴스 피드 한 줄.
 * 제목·요약·언론사·상대 시각을 와이어프레임 순서대로 표시합니다.
 * 상대 시각은 hydrate 이후에만 갱신해 SSR·첫 클라 렌더를 맞춥니다.
 */
function NewsListItem({ item }: NewsListItemProps) {
	const isClient = useIsClient()
	const { title, description, pressName, pubDate, link } = item
	const timeLabel = isClient ? formatRelativeTime(pubDate) : formatNewsPubDateLabel(pubDate)

	return (
		<article className="border-grayscale-200 mb-4 rounded-lg border-2 bg-white p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
			<a href={link} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-2">
				<h2 className="text-grayscale-900 group-hover:text-grayscale-700 text-lg font-semibold tracking-tight">
					{title}
				</h2>
				{description ? <p className="text-grayscale-600 line-clamp-2 text-sm leading-relaxed">{description}</p> : null}
				<p className="text-grayscale-500 flex items-center gap-2 text-sm">
					<span>{pressName}</span>
					{timeLabel ? <span>{timeLabel}</span> : null}
				</p>
			</a>
		</article>
	)
}

export default NewsListItem
