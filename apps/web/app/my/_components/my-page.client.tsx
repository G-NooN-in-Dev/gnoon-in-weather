import { Separator } from '@shared/ui/separator'

import {
	AccountDeleteSection,
	FavoriteLocationsSection,
	FavoritePressListsSection,
	UserInfoEditSection
} from '@/features/my/sections'
import type { MyPageClientProps } from '@/features/my/types/my-page-component.type'

/**
 * 마이페이지 client 조합기.
 */
function MyPageClient({ user, favoriteLocations, favoritePressLists }: MyPageClientProps) {
	return (
		<div className="mt-6 flex flex-col gap-10 px-4">
			<FavoriteLocationsSection initialItems={favoriteLocations} isLoggedIn />
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<FavoritePressListsSection initialItems={favoritePressLists} isLoggedIn />
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<UserInfoEditSection user={user} />
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<AccountDeleteSection favoriteLocations={favoriteLocations} favoritePressLists={favoritePressLists} />
		</div>
	)
}

export default MyPageClient
