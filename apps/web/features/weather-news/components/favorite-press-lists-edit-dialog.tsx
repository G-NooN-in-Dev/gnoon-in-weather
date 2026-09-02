'use client'

import { Button } from '@shared/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@shared/ui/dialog'
import { useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import FavoritePressListEditSession from '@/features/favorite-press-list/components/favorite-press-list-edit-session'
import { FavoritePressList } from '@/types/favorite-press-list.type'

import FavoritePressListsItem from './favorite-press-lists-item'

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
						<>
							<DialogHeader>
								<DialogTitle>선호목록 편집</DialogTitle>
								<DialogDescription>저장된 선호목록을 수정하거나 삭제할 수 있습니다.</DialogDescription>
							</DialogHeader>

							{lists.length === 0 ? (
								<p className="text-grayscale-400 text-sm">저장된 목록이 없습니다.</p>
							) : (
								<FavoritePressListsItem
									items={lists}
									isPending={isPending}
									editText="편집"
									deleteText="삭제"
									onEditStart={setEditingList}
									onDelete={setDeletingList}
								/>
							)}

							<DialogFooter>
								<DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>닫기</DialogClose>
							</DialogFooter>
						</>
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
