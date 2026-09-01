import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Label } from '@shared/ui/label'

import { resolvePressEntries } from '@/lib/favorite-press-list/domains'
import { FavoritePressList } from '@/types/favorite-press-list.type'

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

export default FavoritePressListsEditDialogDefaultContent
export type { FavoritePressListsEditDialogDefaultContentProps }
