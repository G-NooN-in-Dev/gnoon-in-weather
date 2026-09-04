'use client'

import { Badge } from '@shared/ui/badge'
import { X } from 'lucide-react'
import { useState } from 'react'

import ConfirmAlertDialog from '@/components/confirm-alert-dialog'
import type { FavoriteLocationsSectionProps } from '@/features/my/types/my-page-component.type'
import useFavoriteLocations from '@/hooks/use-favorite-locations'
import { FAVORITE_LOCATION_MAX_ITEMS } from '@/lib/favorite-location/constants'
import type { FavoriteLocation } from '@/types/favorite-location.type'

/**
 * 마이페이지 — 관심지역 목록 조회·삭제 섹션.
 */
function FavoriteLocationsSection({ initialItems, isLoggedIn }: FavoriteLocationsSectionProps) {
	const { items, isPending, removeById } = useFavoriteLocations({ initialItems, isLoggedIn })
	const [deletingItem, setDeletingItem] = useState<FavoriteLocation | null>(null)

	const handleConfirmDelete = async () => {
		if (!deletingItem) {
			return
		}

		const success = await removeById(deletingItem.id)

		if (success) {
			setDeletingItem(null)
		}
	}

	return (
		<section className="flex flex-col gap-4 px-4" aria-labelledby="favorite-locations-heading">
			<div className="flex items-baseline gap-2">
				<h2 id="favorite-locations-heading" className="text-xl font-semibold">
					나의 관심지역
				</h2>
				<span className="text-grayscale-500">
					{items.length} / {FAVORITE_LOCATION_MAX_ITEMS}
				</span>
			</div>

			{items.length === 0 ? (
				<p className="text-grayscale-400 text-sm">등록된 관심지역이 없습니다.</p>
			) : (
				<ul className="flex flex-wrap gap-2 md:grid md:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => {
						const { id, label } = item

						return (
							<li key={id} className="max-w-full">
								<Badge className="bg-background text-foreground border-border h-auto min-h-10 max-w-full justify-between gap-1 px-3 py-2 pr-1 text-base whitespace-normal shadow-xs md:w-full">
									<span className="min-w-0 wrap-break-word">{label}</span>
									<button
										type="button"
										aria-label={`${label} 삭제`}
										className="hover:bg-grayscale-100 shrink-0 cursor-pointer rounded-full p-2"
										disabled={isPending}
										onClick={() => setDeletingItem(item)}
									>
										<X className="size-3.5" data-icon="inline-end" />
									</button>
								</Badge>
							</li>
						)
					})}
				</ul>
			)}

			<ConfirmAlertDialog
				open={deletingItem !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDeletingItem(null)
					}
				}}
				title="관심지역 삭제"
				description={`'${deletingItem?.label}' 을(를) 관심지역에서 삭제하시겠습니까?`}
				isPending={isPending}
				onConfirm={handleConfirmDelete}
				confirmText="삭제"
			/>
		</section>
	)
}

export default FavoriteLocationsSection
