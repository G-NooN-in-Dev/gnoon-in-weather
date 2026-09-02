import { FavoritePressListsSection } from '@/features/my/sections'
import { loadFavoritePressListsCached } from '@/services/favorite-press-list.loader.cache.server'

type MyPageFavoritePressListsServerProps = {
	userId: string
}

async function MyPageFavoritePressListsServer({ userId }: MyPageFavoritePressListsServerProps) {
	const initialItems = await loadFavoritePressListsCached(userId)

	return <FavoritePressListsSection initialItems={initialItems} isLoggedIn />
}

export default MyPageFavoritePressListsServer
