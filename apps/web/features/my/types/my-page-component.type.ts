import type { PublicUser } from '@/types/auth.type'
import type { FavoriteLocation } from '@/types/favorite-location.type'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

type MyPageClientProps = {
	user: PublicUser
	favoriteLocations: FavoriteLocation[]
	favoritePressLists: FavoritePressList[]
}

type UserInfoEditSectionProps = {
	user: PublicUser
}

type FavoriteLocationsSectionProps = {
	initialItems: FavoriteLocation[]
	isLoggedIn: boolean
}

type FavoritePressListsSectionProps = {
	initialItems: FavoritePressList[]
	isLoggedIn: boolean
}

export type {
	FavoriteLocationsSectionProps,
	FavoritePressListsSectionProps,
	MyPageClientProps,
	UserInfoEditSectionProps
}
