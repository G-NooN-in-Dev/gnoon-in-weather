import type { PublicUser } from '@/types/auth.type'
import type { FavoriteLocation } from '@/types/favorite-location.type'

type MyPageClientProps = {
	user: PublicUser
	favoriteLocations: FavoriteLocation[]
}

type UserInfoEditSectionProps = {
	user: PublicUser
}

type FavoriteLocationsSectionProps = {
	initialItems: FavoriteLocation[]
	isLoggedIn: boolean
}

export type { FavoriteLocationsSectionProps, MyPageClientProps, UserInfoEditSectionProps }
