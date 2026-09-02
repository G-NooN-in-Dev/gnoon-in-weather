'use client'

import { Dialog, DialogContent } from '@shared/ui/dialog'

import type { FavoritePressList } from '@/types/favorite-press-list.type'

import FavoritePressListEditSession from './favorite-press-list-edit-session'

type FavoritePressListEditDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	list: FavoritePressList | null
	isPending: boolean
	onUpdate: (list: FavoritePressList, domains: string[]) => Promise<boolean>
}

/**
 * 단일 선호목록의 언론사 구성을 수정합니다.
 */
function FavoritePressListEditDialog({
	open,
	onOpenChange,
	list,
	isPending,
	onUpdate
}: FavoritePressListEditDialogProps) {
	const handleClose = () => {
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
				{list ? (
					<FavoritePressListEditSession
						key={list.id}
						list={list}
						isPending={isPending}
						cancelLabel="취소"
						onClose={handleClose}
						onUpdate={onUpdate}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	)
}

export default FavoritePressListEditDialog
