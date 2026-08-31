import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Label } from '@shared/ui/label'
import { Separator } from '@shared/ui/separator'
import { Spinner } from '@shared/ui/spinner'

import { FAVORITE_PRESS_LIST_MAX_PRESSES } from '@/lib/favorite-press-list/constants'
import { arePressDomainsEqual, resolvePressEntries } from '@/lib/favorite-press-list/domains'
import { PRESS_FILTER_GROUPS, PressEntry } from '@/lib/naver/broadcast-press-list'
import { FavoritePressList } from '@/types/favorite-press-list.type'

import PressBadge from './press-badge'
import SelectedPressLists from './selected-press-lists'

type FavoritePressListsEditDialogUpdateContentProps = {
	editingList: FavoritePressList
	draftPresses: PressEntry[]
	onToggle: (press: PressEntry) => void
	onRemove: (domain: string) => void
	isSubmitting: boolean
	onCancel: () => void
	onSave: () => void
}

function FavoritePressListsEditDialogUpdateContent({
	editingList,
	draftPresses,
	onToggle,
	onRemove,
	isSubmitting,
	onCancel,
	onSave
}: FavoritePressListsEditDialogUpdateContentProps) {
	const draftDomainSet = new Set(draftPresses.map((press) => press.domain))
	const isDraftAtLimit = draftPresses.length >= FAVORITE_PRESS_LIST_MAX_PRESSES

	const isEditStatusDirty =
		editingList !== null &&
		!arePressDomainsEqual(
			editingList.domains,
			draftPresses.map((press) => press.domain)
		)

	return (
		<>
			<DialogHeader>
				<DialogTitle>선호목록 수정</DialogTitle>
				<DialogDescription>{`'${editingList.name} 에 포함될 언론사를 선택해주세요. (최대 ${FAVORITE_PRESS_LIST_MAX_PRESSES} 개)`}</DialogDescription>
			</DialogHeader>

			<div className="flex flex-col gap-4">
				{PRESS_FILTER_GROUPS.map((group) => {
					const { id, label, items } = group

					return (
						<div key={id} className="flex flex-col gap-2">
							<h3 className="text-grayscale-600 text-sm font-medium">{label}</h3>
							<ul className="flex flex-wrap gap-2">
								{items.map((press) => {
									const isSelected = draftDomainSet.has(press.domain)
									const isDisabled = isDraftAtLimit && !isSelected

									return (
										<li key={press.domain}>
											<PressBadge press={press} isSelected={isSelected} isDisabled={isDisabled} onToggle={onToggle} />
										</li>
									)
								})}
							</ul>
						</div>
					)
				})}

				<Separator />

				<div className="flex flex-col gap-3">
					<p className="text-grayscale-900 text-sm font-semibold">
						선택됨 ({draftPresses.length}/{FAVORITE_PRESS_LIST_MAX_PRESSES})
					</p>

					<SelectedPressLists
						selectedPresses={draftPresses}
						selectedCount={draftPresses.length}
						onRemove={onRemove}
						isSubmitting={isSubmitting}
					/>
				</div>
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
					뒤로
				</Button>
				<Button
					type="button"
					disabled={!isEditStatusDirty || draftPresses.length === 0 || isSubmitting}
					onClick={onSave}
				>
					{isSubmitting ? <Spinner /> : '저장'}
				</Button>
			</DialogFooter>
		</>
	)
}

type FavoritePressListsEditDialogDefaultContentProps = {
	lists: FavoritePressList[]
	isPending: boolean
	onEditStart: (list: FavoritePressList) => void
	onDelete: (list: FavoritePressList) => void
}

function FavoritePressListsEditDialogDefaultContent({
	lists,
	isPending,
	onEditStart,
	onDelete
}: FavoritePressListsEditDialogDefaultContentProps) {
	return (
		<>
			<DialogHeader>
				<DialogTitle>선호목록 편집</DialogTitle>
				<DialogDescription>저장된 선호목록을 수정하거나 삭제할 수 있습니다.</DialogDescription>
			</DialogHeader>

			{lists.length === 0 ? (
				<p className="text-grayscale-400 text-sm">저장된 목록이 없습니다.</p>
			) : (
				<ul className="flex flex-col gap-4">
					{lists.map((list) => {
						const { domains, id, name } = list

						const presses = resolvePressEntries(domains)

						return (
							<li key={id} className="border-grayscale-200 flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
								<div className="flex items-center justify-between gap-3">
									<Label className="text-grayscale-900 text-sm font-semibold">{name}</Label>
									<div className="flex items-center gap-2">
										<Button
											type="button"
											variant="outline"
											className="border-border/20"
											size="sm"
											disabled={isPending}
											onClick={() => onEditStart(list)}
										>
											수정
										</Button>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											disabled={isPending}
											onClick={() => onDelete(list)}
										>
											삭제
										</Button>
									</div>
								</div>

								<ul className="flex flex-wrap gap-2">
									{presses.map((press) => {
										const { domain, name } = press

										return (
											<li key={domain}>
												<Badge variant="outline" className="h-7 px-2.5 text-sm">
													{name}
												</Badge>
											</li>
										)
									})}
								</ul>
							</li>
						)
					})}
				</ul>
			)}

			<DialogFooter>
				<DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>닫기</DialogClose>
			</DialogFooter>
		</>
	)
}

export { FavoritePressListsEditDialogDefaultContent, FavoritePressListsEditDialogUpdateContent }
