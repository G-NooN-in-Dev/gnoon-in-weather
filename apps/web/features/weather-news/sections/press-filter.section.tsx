'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { RotateCwIcon } from 'lucide-react'

import type { PressFilterSectionProps } from '@/features/weather-news/types/weather-news-component.type'
import { FAVORITE_PRESS_LIST_MAX_ITEMS } from '@/lib/favorite-press-list/constants'
import { PRESS_FILTER_GROUPS } from '@/lib/naver/broadcast-press-list'

import FavoritePressLists from '../components/favorite-press-lists'
import PressBadge from '../components/press-badge'
import SelectedPressLists from '../components/selected-press-lists'

/**
 * 우측 언론사 필터 패널.
 * 언론사 목록은 피드 필터용이며, 선호목록 추가는 상단 추가 버튼 → Dialog에서 별도로 구성합니다.
 * 선호목록 이름은 클릭 시 확인 후 적용되며, 이미 적용 중이면 다시 클릭해 해제합니다.
 */
function PressFilterSection({
	isLoggedIn,
	favoriteLists,
	appliedListId,
	isFavoriteListsLoading,
	selectedPresses,
	maxSelection,
	isAddDisabled,
	isPending,
	onToggle,
	onRemove,
	onReset,
	onAddClick,
	onEditClick,
	onApplyClick,
	className
}: PressFilterSectionProps) {
	const selectedCount = selectedPresses.length
	const isAtLimit = selectedCount >= maxSelection
	const selectedDomainSet = new Set(selectedPresses.map((press) => press.domain))
	const favoriteListCount = favoriteLists.length

	return (
		<section className={cn('flex w-full flex-col gap-6 rounded-lg bg-white p-4', className)} aria-label="언론사 필터">
			<div className="border-grayscale-200 flex flex-col gap-3 border-b pb-6">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-baseline gap-2">
						<h2 className="text-grayscale-900 text-base font-semibold">내 선호목록</h2>
						<span
							className="text-grayscale-500 text-sm"
							aria-label={`선호목록 ${favoriteListCount}개 중 최대 ${FAVORITE_PRESS_LIST_MAX_ITEMS}개`}
						>
							{favoriteListCount} / {FAVORITE_PRESS_LIST_MAX_ITEMS}
						</span>
					</div>
					{isLoggedIn ? (
						<div className="flex items-center gap-1">
							<Button
								type="button"
								variant="text"
								size="sm"
								className="h-auto px-1"
								disabled={isAddDisabled || isPending || favoriteListCount >= FAVORITE_PRESS_LIST_MAX_ITEMS}
								onClick={onAddClick}
							>
								추가
							</Button>
							{favoriteListCount > 0 ? (
								<Button
									type="button"
									variant="text"
									size="sm"
									className="h-auto px-1"
									disabled={isPending || favoriteListCount === 0}
									onClick={onEditClick}
								>
									편집
								</Button>
							) : null}
						</div>
					) : null}
				</div>

				<FavoritePressLists
					isLoggedIn={isLoggedIn}
					favoriteLists={favoriteLists}
					appliedListId={appliedListId}
					isLoading={isFavoriteListsLoading}
					isPending={isPending}
					onApplyClick={onApplyClick}
				/>
			</div>

			<div className="flex flex-col gap-5">
				<h2 className="text-grayscale-900 text-base font-semibold">언론사 목록</h2>

				{PRESS_FILTER_GROUPS.map((group) => {
					const { id, label, items } = group

					return (
						<div key={id} className="flex flex-col gap-2">
							<h3 className="text-grayscale-600 text-sm font-medium">{label}</h3>
							<ul className="flex flex-wrap gap-2">
								{items.map((press) => {
									const { domain } = press
									const isSelected = selectedDomainSet.has(domain)
									const isDisabled = isAtLimit && !isSelected

									return (
										<li key={domain}>
											<PressBadge press={press} isSelected={isSelected} isDisabled={isDisabled} onToggle={onToggle} />
										</li>
									)
								})}
							</ul>
						</div>
					)
				})}
			</div>

			<div className="border-grayscale-200 flex flex-col gap-3 border-t pt-6">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-grayscale-900 text-base font-semibold">
						현재 적용 ({selectedCount}/{maxSelection})
					</h2>
					<Button
						type="button"
						variant="text"
						size="sm"
						className="text-grayscale-500 h-auto px-1 text-xs"
						onClick={onReset}
						disabled={selectedCount === 0 || isPending}
					>
						<RotateCwIcon className="size-4" data-icon="inline-end" />
						초기화
					</Button>
				</div>

				<SelectedPressLists
					selectedPresses={selectedPresses}
					selectedCount={selectedCount}
					onRemove={onRemove}
					isSubmitting={isPending}
				/>
			</div>
		</section>
	)
}

export default PressFilterSection
