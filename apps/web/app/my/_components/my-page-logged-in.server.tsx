import { Separator } from '@shared/ui/separator'
import { Suspense } from 'react'

import MyPageAccountDeleteServer from '@/app/my/_components/my-page-account-delete.server'
import MyPageFavoriteLocationsServer from '@/app/my/_components/my-page-favorite-locations.server'
import MyPageFavoritePressListsServer from '@/app/my/_components/my-page-favorite-press-lists.server'
import {
	MyPageAccountDeleteSkeleton,
	MyPageFavoriteLocationsSkeleton,
	MyPageFavoritePressListsSkeleton
} from '@/components/skeletons/page-skeletons'
import { UserInfoEditSection } from '@/features/my/sections'
import type { PublicUser } from '@/types/auth.type'

type MyPageLoggedInServerProps = {
	user: PublicUser
}

function MyPageLoggedInServer({ user }: MyPageLoggedInServerProps) {
	return (
		<div className="mt-6 flex flex-col gap-10 px-4">
			<Suspense fallback={<MyPageFavoriteLocationsSkeleton />}>
				<MyPageFavoriteLocationsServer userId={user.id} />
			</Suspense>
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<Suspense fallback={<MyPageFavoritePressListsSkeleton />}>
				<MyPageFavoritePressListsServer userId={user.id} />
			</Suspense>
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<UserInfoEditSection user={user} />
			<Separator className="bg-grayscale-700 data-[orientation=horizontal]:h-0.5" />
			<Suspense fallback={<MyPageAccountDeleteSkeleton />}>
				<MyPageAccountDeleteServer userId={user.id} />
			</Suspense>
		</div>
	)
}

export default MyPageLoggedInServer
