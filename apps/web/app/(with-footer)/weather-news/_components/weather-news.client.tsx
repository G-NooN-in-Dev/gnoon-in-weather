'use client'

import { Button } from '@shared/ui/button'
import { useIsMobile } from '@shared/ui/hooks/use-mobile'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@shared/ui/sheet'
import { toast } from '@shared/ui/sonner'
import { cn } from '@shared/ui/utils'
import { ListFilterIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import FavoritePressListsCreateDialog from '@/features/weather-news/components/favorite-press-lists-create-dialog'
import FavoritePressListsEditDialog from '@/features/weather-news/components/favorite-press-lists-edit-dialog'
import useWeatherNews from '@/features/weather-news/hooks/use-weather-news'
import { NewsFeedSection, PressFilterSection } from '@/features/weather-news/sections'
import type { WeatherNewsClientProps } from '@/features/weather-news/types/weather-news-component.type'
import useFavoritePressLists from '@/hooks/use-favorite-press-lists'
import { FAVORITE_PRESS_LIST_MAX_ITEMS, FAVORITE_PRESS_LIST_TOAST } from '@/lib/favorite-press-list/constants'
import { resolvePressEntries } from '@/lib/favorite-press-list/domains'
import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import { filterNewsBySelectedPress } from '@/lib/naver/filter-naver-news'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

const MAX_PRESS_SELECTION = 5

/**
 * 날씨 뉴스 페이지 client 조합기.
 * lg+: 좌측 피드 + 우측 언론사 필터 / lg 미만: 피드 전폭 + Sheet 필터.
 * Sheet는 md 미만 bottom, md~lg right. 필터 최대 5개·선택 즉시 반영.
 */
function WeatherNewsClient({ isLoggedIn, initialPage, initialError }: WeatherNewsClientProps) {
	const { items, hasMore, loadingMore, error, loadMore } = useWeatherNews({
		initialPage,
		initialError
	})
	const {
		items: favoriteLists,
		isLoading,
		isPending,
		createList,
		updateList,
		removeList
	} = useFavoritePressLists({
		isLoggedIn
	})
	const isMobile = useIsMobile()
	const filterSheetSide = isMobile ? 'bottom' : 'right'

	const [selectedPresses, setSelectedPresses] = useState<PressEntry[]>([])
	const [appliedListId, setAppliedListId] = useState<string | null>(null)
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const [editDialogOpen, setEditDialogOpen] = useState(false)
	const [pendingApplyList, setPendingApplyList] = useState<FavoritePressList | null>(null)
	const [filterSheetOpen, setFilterSheetOpen] = useState(false)

	const applyConfirmDescription = useMemo(() => {
		if (!pendingApplyList) {
			return ''
		}

		return `'${pendingApplyList.name}' 선호목록을 적용하시겠습니까?`
	}, [pendingApplyList])

	const isAddDisabled = !isLoggedIn || favoriteLists.length >= FAVORITE_PRESS_LIST_MAX_ITEMS

	const isFiltered = selectedPresses.length > 0
	const filteredItems = filterNewsBySelectedPress(
		items,
		selectedPresses.map((press) => press.domain)
	)

	function handleToggle(press: PressEntry) {
		const { domain } = press

		setSelectedPresses((prev) => {
			if (prev.some((item) => item.domain === domain)) {
				return prev.filter((item) => item.domain !== domain)
			}

			if (prev.length >= MAX_PRESS_SELECTION) {
				return prev
			}

			return [...prev, press]
		})
		setAppliedListId(null)
	}

	function handleRemove(domain: string) {
		setSelectedPresses((prev) => prev.filter((item) => item.domain !== domain))
		setAppliedListId(null)
	}

	function handleReset() {
		setSelectedPresses([])
		setAppliedListId(null)
	}

	function handleAddClick() {
		if (favoriteLists.length >= FAVORITE_PRESS_LIST_MAX_ITEMS) {
			toast.error(FAVORITE_PRESS_LIST_TOAST.LIMIT_REACHED)
			return
		}

		setCreateDialogOpen(true)
	}

	async function handleCreate(input: { name: string; domains: string[] }) {
		const item = await createList(input)

		return item !== null
	}

	function handleApplyClick(list: FavoritePressList) {
		// 이미 적용 중인 목록이면 확인 없이 선택 해제합니다.
		if (appliedListId === list.id) {
			setSelectedPresses([])
			setAppliedListId(null)
			toast.success(FAVORITE_PRESS_LIST_TOAST.UNAPPLIED)
			return
		}

		setPendingApplyList(list)
	}

	function handleConfirmApply() {
		if (!pendingApplyList) {
			return
		}

		setSelectedPresses(resolvePressEntries(pendingApplyList.domains))
		setAppliedListId(pendingApplyList.id)
		toast.success(FAVORITE_PRESS_LIST_TOAST.APPLIED)
		setPendingApplyList(null)
		setFilterSheetOpen(false)
	}

	async function handleUpdate(list: FavoritePressList, domains: string[]) {
		const item = await updateList({ id: list.id, domains })

		if (!item) {
			return false
		}

		// 현재 적용 중인 목록이면 선택 상태도 함께 맞춥니다.
		if (appliedListId === list.id) {
			setSelectedPresses(resolvePressEntries(item.domains))
		}

		return true
	}

	async function handleDelete(list: FavoritePressList) {
		const removed = await removeList(list.id)

		if (!removed) {
			return false
		}

		if (appliedListId === list.id) {
			setAppliedListId(null)
		}

		return true
	}

	const pressFilterProps = {
		isLoggedIn,
		favoriteLists,
		appliedListId,
		isFavoriteListsLoading: isLoading,
		selectedPresses,
		maxSelection: MAX_PRESS_SELECTION,
		isAddDisabled,
		isPending,
		onToggle: handleToggle,
		onRemove: handleRemove,
		onReset: handleReset,
		onAddClick: handleAddClick,
		onEditClick: () => setEditDialogOpen(true),
		onApplyClick: handleApplyClick
	}

	const selectedCount = selectedPresses.length
	const filterTriggerLabel = selectedCount > 0 ? `필터 (${selectedCount})` : '필터'

	return (
		<div className="flex flex-col gap-10 px-6 md:px-8 lg:flex-row lg:px-10">
			<div className="flex w-full flex-col lg:w-2/3">
				<NewsFeedSection
					items={filteredItems}
					loadedCount={items.length}
					isFiltered={isFiltered}
					hasMore={hasMore}
					loadingMore={loadingMore}
					errorMessage={error?.message || null}
					onLoadMore={loadMore}
					headerAction={
						<Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
							<SheetTrigger
								render={
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="lg:hidden"
										aria-label={filterTriggerLabel}
									/>
								}
							>
								<ListFilterIcon className="size-4" data-icon="inline-start" />
								{filterTriggerLabel}
							</SheetTrigger>
							<SheetContent
								side={filterSheetSide}
								className={cn(
									'gap-0 p-0',
									isMobile ? 'max-h-[85dvh] w-full overflow-hidden' : 'h-full w-full max-w-sm'
								)}
							>
								<SheetHeader className="border-border shrink-0 border-b">
									<SheetTitle>언론사 필터</SheetTitle>
									<SheetDescription hidden />
								</SheetHeader>
								<div className="min-h-0 flex-1 overflow-y-auto">
									<PressFilterSection {...pressFilterProps} className="rounded-none p-4" />
								</div>
							</SheetContent>
						</Sheet>
					}
				/>
			</div>
			<aside className="hidden w-1/3 shrink-0 lg:block">
				<div className="sticky top-6">
					<PressFilterSection {...pressFilterProps} />
				</div>
			</aside>

			<FavoritePressListsCreateDialog
				open={createDialogOpen}
				onOpenChange={setCreateDialogOpen}
				isSubmitting={isPending}
				onSave={handleCreate}
			/>

			<FavoritePressListsEditDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				lists={favoriteLists}
				isPending={isPending}
				onUpdate={handleUpdate}
				onDelete={handleDelete}
			/>

			<ConfirmAlertDialog
				open={pendingApplyList !== null}
				onOpenChange={(nextOpen) => {
					if (!nextOpen) {
						setPendingApplyList(null)
					}
				}}
				title="선호목록 적용"
				description={applyConfirmDescription}
				isPending={isPending}
				onConfirm={handleConfirmApply}
				confirmText="적용"
			/>
		</div>
	)
}

export default WeatherNewsClient
