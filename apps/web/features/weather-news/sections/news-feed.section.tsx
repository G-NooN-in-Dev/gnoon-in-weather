'use client'

import { Button } from '@shared/ui/button'
import { Spinner } from '@shared/ui/spinner'

import NewsListItem from '@/features/weather-news/components/news-list-item'
import type { NewsFeedSectionProps } from '@/features/weather-news/types/weather-news-component.type'

import EmptyFeedMessage from '../components/empty-feed-message'

/**
 * 좌측 뉴스 피드 섹션.
 * 상단에 표시·불러온 건수를 두고, ‘더 보기’로 다음 페이지를 이어 붙입니다.
 * 언론사 필터로 목록이 비어도 hasMore이면 「더 보기」를 유지합니다.
 */
function NewsFeedSection({
	items,
	loadedCount,
	isFiltered,
	hasMore,
	loadingMore,
	errorMessage,
	onLoadMore
}: NewsFeedSectionProps) {
	const visibleCount = items.length
	const isEmpty = visibleCount === 0
	const showErrorOnly = Boolean(errorMessage) && isEmpty

	return (
		<section className="flex w-full flex-col" aria-label="날씨 뉴스 목록">
			<p className="text-grayscale-500 mb-4 text-sm" aria-live="polite">
				총{' '}
				<span className="text-grayscale-800 font-medium">
					{isFiltered ? `${visibleCount} / ${loadedCount}` : loadedCount}
				</span>{' '}
				건
			</p>

			{showErrorOnly ? <p className="text-destructive py-8 text-sm">{errorMessage}</p> : null}

			{isEmpty && !errorMessage ? <EmptyFeedMessage isFiltered={isFiltered} hasMore={hasMore} /> : null}

			{!isEmpty ? (
				<ul className="flex flex-col">
					{items.map((item) => (
						<li key={item.id}>
							<NewsListItem item={item} />
						</li>
					))}
				</ul>
			) : null}

			{errorMessage && !isEmpty ? <p className="text-destructive py-3 text-sm">{errorMessage}</p> : null}

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

			{!hasMore && !isEmpty ? <p className="text-grayscale-400 py-6 text-center text-sm">마지막 뉴스입니다.</p> : null}

			{!hasMore && isEmpty && isFiltered && !errorMessage ? (
				<p className="text-grayscale-400 py-2 text-center text-sm">더 이상 불러올 뉴스가 없습니다.</p>
			) : null}
		</section>
	)
}

export default NewsFeedSection
