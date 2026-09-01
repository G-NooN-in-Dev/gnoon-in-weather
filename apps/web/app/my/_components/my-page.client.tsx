import { Separator } from '@shared/ui/separator'

import FavoriteLocationsSection from '@/features/my/sections/favorite-locations.section'
import FavoritePressListsSection from '@/features/my/sections/favorite-press-lists.section'
import UserInfoEditSection from '@/features/my/sections/user-info-edit.section'
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
		</div>
	)
}

export default MyPageClient
