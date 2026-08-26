'use client'

import { Button } from '@shared/ui/button'
import { Spinner } from '@shared/ui/spinner'

import NewsListItem from '@/features/weather-news/components/news-list-item'
import type { NewsFeedSectionProps } from '@/features/weather-news/types/weather-news-component.type'

/**
 * 좌측 뉴스 피드 섹션.
 * ‘더 보기’로 다음 페이지를 목록 아래에 이어 붙입니다.
 */
function NewsFeedSection({ items, hasMore, loadingMore, errorMessage, onLoadMore }: NewsFeedSectionProps) {
	if (items.length === 0 && !errorMessage) {
		return <p className="text-grayscale-500 py-8 text-sm">표시할 날씨 뉴스가 없습니다.</p>
	}

	return (
		<section className="flex w-full flex-col" aria-label="날씨 뉴스 목록">
			{errorMessage && items.length === 0 ? (
				<p className="text-destructive py-8 text-sm">{errorMessage}</p>
			) : (
				<ul className="flex flex-col">
					{items.map((item) => (
						<li key={item.id}>
							<NewsListItem item={item} />
						</li>
					))}
				</ul>
			)}

			{errorMessage && items.length > 0 ? <p className="text-destructive py-3 text-sm">{errorMessage}</p> : null}

			{hasMore ? (
				<div className="flex flex-col items-center py-6">
					<Button
						type="button"
						variant="outline"
						className="w-full max-w-xs"
						disabled={loadingMore}
						onClick={onLoadMore}
					>
						{loadingMore ? '불러오는 중…' : '더 보기'}
					</Button>
				</div>
			) : null}

			{loadingMore && (
				<div className="flex items-center justify-center py-4">
					<Spinner className="text-grayscale-500 size-8 animate-spin" />
				</div>
			)}

			{!hasMore && items.length > 0 ? (
				<p className="text-grayscale-400 py-6 text-center text-sm">마지막 뉴스입니다.</p>
			) : null}
		</section>
	)
}

export default NewsFeedSection
