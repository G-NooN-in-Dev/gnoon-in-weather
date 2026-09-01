'use client'

import { Dialog, DialogContent } from '@shared/ui/dialog'
import { useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import FavoritePressListEditSession from '@/features/favorite-press-list/components/favorite-press-list-edit-session'
import { FavoritePressList } from '@/types/favorite-press-list.type'

import FavoritePressListsEditDialogDefaultContent from './favorite-press-lists-edit-dialog-content'

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
	const [deletingList, setDeletingList] = useState<FavoritePressList | null>(null)

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			setEditingList(null)
			setDeletingList(null)
		}

		onOpenChange(nextOpen)
	}

	const handleClose = () => {
		setEditingList(null)
	}

	const handleConfirmDelete = async () => {
		if (!deletingList) {
			return
		}

		const removed = await onDelete(deletingList)

		if (removed) {
			if (editingList?.id === deletingList.id) {
				setEditingList(null)
			}

			setDeletingList(null)
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
					{editingList ? (
						<FavoritePressListEditSession
							key={editingList.id}
							list={editingList}
							isPending={isPending}
							onClose={handleClose}
							onUpdate={onUpdate}
						/>
					) : (
						<FavoritePressListsEditDialogDefaultContent
							lists={lists}
							isPending={isPending}
							onEditStart={setEditingList}
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
