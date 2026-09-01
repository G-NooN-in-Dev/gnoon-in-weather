'use client'

import { Dialog, DialogContent } from '@shared/ui/dialog'
import { useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import { FAVORITE_PRESS_LIST_MAX_PRESSES } from '@/lib/favorite-press-list/constants'
import { resolvePressEntries } from '@/lib/favorite-press-list/domains'
import { PressEntry } from '@/lib/naver/broadcast-press-list'
import { FavoritePressList } from '@/types/favorite-press-list.type'

import {
	FavoritePressListsEditDialogDefaultContent,
	FavoritePressListsEditDialogUpdateContent
} from './favorite-press-lists-edit-dialog-content'

type FavoritePressListsEditDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	lists: FavoritePressList[]
	isPending: boolean
	onUpdate: (list: FavoritePressList, domains: string[]) => Promise<boolean>
	onDelete: (list: FavoritePressList) => Promise<boolean>
}

/**
 * 저장된 선호목록을 조회·수정·삭제합니다.
 */
function FavoritePressListsEditDialog({
	open,
	onOpenChange,
	lists,
	isPending,
	onUpdate,
	onDelete
}: FavoritePressListsEditDialogProps) {
	const [editingList, setEditingList] = useState<FavoritePressList | null>(null)
	const [draftPresses, setDraftPresses] = useState<PressEntry[]>([])
	const [deletingList, setDeletingList] = useState<FavoritePressList | null>(null)

	const resetEditingState = () => {
		setEditingList(null)
		setDraftPresses([])
	}

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			resetEditingState()
			setDeletingList(null)
		}

		onOpenChange(nextOpen)
	}

	const handleStartEdit = (list: FavoritePressList) => {
		setEditingList(list)
		setDraftPresses(resolvePressEntries(list.domains))
	}

	const handleToggleDraft = (press: PressEntry) => {
		const { domain } = press

		setDraftPresses((prev) => {
			if (prev.some((item) => item.domain === domain)) {
				return prev.filter((item) => item.domain !== domain)
			}

			if (prev.length >= FAVORITE_PRESS_LIST_MAX_PRESSES) {
				return prev
			}

			return [...prev, press]
		})
	}

	const handleRemoveDraft = (domain: string) => {
		setDraftPresses((prev) => prev.filter((item) => item.domain !== domain))
	}

	const handleSave = async () => {
		if (!editingList || draftPresses.length === 0) {
			return
		}

		const domains = draftPresses.map((press) => press.domain)
		const updated = await onUpdate(editingList, domains)

		if (updated) {
			resetEditingState()
		}
	}

	const handleConfirmDelete = async () => {
		if (!deletingList) {
			return
		}

		const removed = await onDelete(deletingList)

		if (removed) {
			if (editingList?.id === deletingList.id) {
				resetEditingState()
			}

			setDeletingList(null)
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
					{editingList ? (
						<FavoritePressListsEditDialogUpdateContent
							editingList={editingList}
							draftPresses={draftPresses}
							onToggle={handleToggleDraft}
							onRemove={handleRemoveDraft}
							isSubmitting={isPending}
							onCancel={resetEditingState}
							onSave={handleSave}
						/>
					) : (
						<FavoritePressListsEditDialogDefaultContent
							lists={lists}
							isPending={isPending}
							onEditStart={handleStartEdit}
							onDelete={setDeletingList}
						/>
					)}
				</DialogContent>
			</Dialog>

			<ConfirmAlertDialog
				open={deletingList !== null}
				onOpenChange={(nextOpen) => {
					if (!nextOpen) {
						setDeletingList(null)
					}
				}}
				title="선호목록 삭제"
				description={deletingList ? `'${deletingList.name}' 선호목록을 삭제하시겠습니까?` : ''}
				isPending={isPending}
				onConfirm={handleConfirmDelete}
				confirmText="삭제"
			/>
		</>
	)
}

export default FavoritePressListsEditDialog
export type { FavoritePressListsEditDialogProps }
