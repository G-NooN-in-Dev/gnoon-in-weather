import { FavoriteLocationsSection } from '@/features/my/sections'
import { loadFavoriteLocationsCached } from '@/services/favorite-location.loader.cache.server'

type MyPageFavoriteLocationsServerProps = {
	userId: string
}

async function MyPageFavoriteLocationsServer({ userId }: MyPageFavoriteLocationsServerProps) {
	const initialItems = await loadFavoriteLocationsCached(userId)

	return <FavoriteLocationsSection initialItems={initialItems} isLoggedIn />
}

export default MyPageFavoriteLocationsServer
