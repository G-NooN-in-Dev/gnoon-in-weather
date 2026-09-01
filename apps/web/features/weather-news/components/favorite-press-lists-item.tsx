import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Label } from '@shared/ui/label'

import { resolvePressEntries } from '@/lib/favorite-press-list/domains'
import { FavoritePressList } from '@/types/favorite-press-list.type'

type FavoritePressListsItemProps = {
	items: FavoritePressList[]
	isPending: boolean
	editText: string
	deleteText: string
	onEditStart: (list: FavoritePressList) => void
	onDelete: (list: FavoritePressList) => void
}

function FavoritePressListsItem({
	items,
	isPending,
	editText = '편집',
	deleteText = '삭제',
	onEditStart,
	onDelete
}: FavoritePressListsItemProps) {
	return (
		<ul className="flex flex-col gap-4">
			{items.map((item) => {
				const { domains, id, name } = item

				const presses = resolvePressEntries(domains)

				return (
					<li key={id} className="border-grayscale-300 flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
						<div className="flex items-center justify-between gap-3">
							<Label className="text-grayscale-900 text-lg font-semibold">{name}</Label>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="text"
									className="border-border/20"
									size="sm"
									disabled={isPending}
									onClick={() => onEditStart(item)}
								>
									{editText}
								</Button>
								<Button
									type="button"
									variant="text"
									size="sm"
									className="text-destructive hover:text-destructive/80"
									disabled={isPending}
									onClick={() => onDelete(item)}
								>
									{deleteText}
								</Button>
							</div>
						</div>

						<ul className="flex flex-wrap gap-2">
							{presses.map((press) => {
								const { domain, name: pressName } = press

								return (
									<li key={domain}>
										<Badge variant="outline" className="h-7 bg-white px-2.5 text-sm">
											{pressName}
										</Badge>
									</li>
								)
							})}
						</ul>
					</li>
				)
			})}
		</ul>
	)
}

export default FavoritePressListsItem
