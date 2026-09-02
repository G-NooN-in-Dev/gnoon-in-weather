'use client'

import { useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import FavoritePressListEditDialog from '@/features/favorite-press-list/components/favorite-press-list-edit-dialog'
import type { FavoritePressListsSectionProps } from '@/features/my/types/my-page-component.type'
import FavoritePressListsItem from '@/features/weather-news/components/favorite-press-lists-item'
import { useFavoritePressLists } from '@/hooks/use-favorite-press-lists'
import { FAVORITE_PRESS_LIST_MAX_ITEMS } from '@/lib/favorite-press-list/constants'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

/**
 * 마이페이지 — 언론사 선호목록 조회·수정·삭제 섹션.
 */
function FavoritePressListsSection({ initialItems, isLoggedIn }: FavoritePressListsSectionProps) {
	const { items, isPending, updateList, removeList } = useFavoritePressLists({ initialItems, isLoggedIn })
	const [editingList, setEditingList] = useState<FavoritePressList | null>(null)
	const [deletingList, setDeletingList] = useState<FavoritePressList | null>(null)

	const handleUpdate = async (list: FavoritePressList, domains: string[]) => {
		const updated = await updateList({ id: list.id, domains })

		return updated !== null
	}

	const handleConfirmDelete = async () => {
		if (!deletingList) {
			return
		}

		const success = await removeList(deletingList.id)

		if (success) {
			setDeletingList(null)
		}
	}

	return (
		<section className="flex flex-col gap-4 px-4" aria-labelledby="favorite-press-lists-heading">
			<div className="flex items-baseline gap-2">
				<h2 id="favorite-press-lists-heading" className="text-xl font-semibold">
					나의 언론사 선호 목록
				</h2>
				<span className="text-grayscale-500">
					{items.length} / {FAVORITE_PRESS_LIST_MAX_ITEMS}
				</span>
			</div>

			{items.length === 0 ? (
				<p className="text-grayscale-400 text-sm">저장된 목록이 없습니다.</p>
			) : (
				<FavoritePressListsItem
					items={items}
					isPending={isPending}
					editText="편집"
					deleteText="삭제"
					onEditStart={setEditingList}
					onDelete={setDeletingList}
				/>
			)}

			<FavoritePressListEditDialog
				open={editingList !== null}
				onOpenChange={(open) => {
					if (!open) {
						setEditingList(null)
					}
				}}
				list={editingList}
				isPending={isPending}
				onUpdate={handleUpdate}
			/>

			<ConfirmAlertDialog
				open={deletingList !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDeletingList(null)
					}
				}}
				title="선호목록 삭제"
				description={deletingList ? `'${deletingList.name}' 선호목록을 삭제하시겠습니까?` : ''}
				isPending={isPending}
				onConfirm={handleConfirmDelete}
				confirmText="삭제"
			/>
		</section>
	)
}

export default FavoritePressListsSection
