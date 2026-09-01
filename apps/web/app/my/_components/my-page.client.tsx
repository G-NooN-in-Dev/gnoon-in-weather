import { Separator } from '@shared/ui/separator'

import FavoriteLocationsSection from '@/features/my/sections/favorite-locations.section'
import UserInfoEditSection from '@/features/my/sections/user-info-edit.section'
import type { MyPageClientProps } from '@/features/my/types/my-page-component.type'

/**
 * 마이페이지 client 조합기.
 */
function MyPageClient({ user, favoriteLocations }: MyPageClientProps) {
	return (
		<div className="flex flex-col gap-6">
			<FavoriteLocationsSection initialItems={favoriteLocations} isLoggedIn />
			<Separator className="bg-grayscale-400 data-[orientation=horizontal]:h-0.5" />
			<UserInfoEditSection user={user} />
		</div>
	)
}

export default MyPageClient
