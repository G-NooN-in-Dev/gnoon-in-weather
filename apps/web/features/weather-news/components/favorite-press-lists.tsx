import { Button } from '@shared/ui/button'
import { Spinner } from '@shared/ui/spinner'

import { FavoritePressList } from '@/types/favorite-press-list.type'

type FavoritePressListsProps = {
	isLoggedIn: boolean
	favoriteLists: FavoritePressList[]
	appliedListId: string | null
	isLoading: boolean
	isPending: boolean
	onApplyClick: (list: FavoritePressList) => void
}

function FavoritePressLists({
	isLoggedIn,
	favoriteLists,
	appliedListId,
	isLoading,
	isPending,
	onApplyClick
}: FavoritePressListsProps) {
	if (!isLoggedIn) {
		return <p className="text-grayscale-400 text-sm">로그인 후 사용 가능합니다.</p>
	}

	if (isLoading) {
		return (
			<div className="text-grayscale-400 flex items-start gap-2 text-sm">
				<Spinner className="mx-0 shrink-0" />
				<span>선호목록을 불러오는 중입니다.</span>
			</div>
		)
	}

	if (favoriteLists.length === 0) {
		return <p className="text-grayscale-400 text-sm">저장된 선호목록이 없습니다.</p>
	}

	return (
		<ul className="flex flex-wrap gap-2">
			{favoriteLists.map((list) => {
				const { id, name } = list

				const isApplied = appliedListId === id

				return (
					<li key={id}>
						<Button
							variant="text"
							size="sm"
							className="h-auto py-0.5"
							disabled={isPending}
							aria-pressed={isApplied}
							onClick={() => onApplyClick(list)}
						>
							{name}
						</Button>
					</li>
				)
			})}
		</ul>
	)
}

export default FavoritePressLists
