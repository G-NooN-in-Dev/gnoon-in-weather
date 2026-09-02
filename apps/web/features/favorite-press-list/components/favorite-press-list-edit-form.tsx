import { Button } from '@shared/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Separator } from '@shared/ui/separator'
import { Spinner } from '@shared/ui/spinner'

import PressBadge from '@/features/weather-news/components/press-badge'
import SelectedPressLists from '@/features/weather-news/components/selected-press-lists'
import { FAVORITE_PRESS_LIST_MAX_PRESSES } from '@/lib/favorite-press-list/constants'
import { arePressDomainsEqual } from '@/lib/favorite-press-list/domains'
import { PRESS_FILTER_GROUPS, PressEntry } from '@/lib/naver/broadcast-press-list'
import { FavoritePressList } from '@/types/favorite-press-list.type'

type FavoritePressListEditFormProps = {
	list: FavoritePressList
	draftPresses: PressEntry[]
	onToggle: (press: PressEntry) => void
	onRemove: (domain: string) => void
	isSubmitting: boolean
	cancelLabel: string
	onCancel: () => void
	onSave: () => void
}

function FavoritePressListEditForm({
	list,
	draftPresses,
	onToggle,
	onRemove,
	isSubmitting,
	cancelLabel,
	onCancel,
	onSave
}: FavoritePressListEditFormProps) {
	const draftDomainSet = new Set(draftPresses.map((press) => press.domain))
	const isDraftAtLimit = draftPresses.length >= FAVORITE_PRESS_LIST_MAX_PRESSES

	const isEditStatusDirty = !arePressDomainsEqual(
		list.domains,
		draftPresses.map((press) => press.domain)
	)

	return (
		<>
			<DialogHeader>
				<DialogTitle>선호목록 수정</DialogTitle>
				<DialogDescription>{`'${list.name} 에 포함할 언론사를 선택해주세요. (최대 ${FAVORITE_PRESS_LIST_MAX_PRESSES} 개)`}</DialogDescription>
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
					{cancelLabel}
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

export default FavoritePressListEditForm
export type { FavoritePressListEditFormProps }
