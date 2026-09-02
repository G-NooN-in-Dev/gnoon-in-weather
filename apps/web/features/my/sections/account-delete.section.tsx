import AccountDeleteDialog from '@/features/my/components/account-delete-dialog'
import type { AccountDeleteSectionProps } from '@/features/my/types/my-page-component.type'

/**
 * 마이페이지 — 회원탈퇴 섹션.
 */
function AccountDeleteSection({ favoriteLocations, favoritePressLists }: AccountDeleteSectionProps) {
	return (
		<section className="flex flex-col gap-4 px-4" aria-labelledby="account-delete-heading">
			<h2 id="account-delete-heading" className="text-xl font-semibold">
				회원탈퇴
			</h2>
			<div className="flex max-w-3xs items-start">
				<AccountDeleteDialog
					hasFavoriteLocations={favoriteLocations.length > 0}
					hasFavoritePressLists={favoritePressLists.length > 0}
				/>
			</div>
		</section>
	)
}

export default AccountDeleteSection
