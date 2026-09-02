import { AccountDeleteSection } from '@/features/my/sections'
import { loadFavoriteLocationsCached } from '@/services/favorite-location.loader.cache.server'
import { loadFavoritePressListsCached } from '@/services/favorite-press-list.loader.cache.server'

type MyPageAccountDeleteServerProps = {
	userId: string
}

async function MyPageAccountDeleteServer({ userId }: MyPageAccountDeleteServerProps) {
	const [favoriteLocations, favoritePressLists] = await Promise.all([
		loadFavoriteLocationsCached(userId),
		loadFavoritePressListsCached(userId)
	])

	return <AccountDeleteSection favoriteLocations={favoriteLocations} favoritePressLists={favoritePressLists} />
}

export default MyPageAccountDeleteServer
