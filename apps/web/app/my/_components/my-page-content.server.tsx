import MyPageClient from '@/app/my/_components/my-page.client'
import { loadFavoriteLocations } from '@/services/favorite-location.loader'
import { loadFavoritePressLists } from '@/services/favorite-press-list.loader'
import type { PublicUser } from '@/types/auth.type'

type MyPageContentServerProps = {
	user: PublicUser
}

async function MyPageContentServer({ user }: MyPageContentServerProps) {
	const [favoriteLocations, favoritePressLists] = await Promise.all([
		loadFavoriteLocations(user.id),
		loadFavoritePressLists(user.id)
	])

	return <MyPageClient user={user} favoriteLocations={favoriteLocations} favoritePressLists={favoritePressLists} />
}

export default MyPageContentServer
