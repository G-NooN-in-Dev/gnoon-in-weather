import { UserRoundX } from 'lucide-react'

import MyPageLoggedInServer from '@/app/(with-footer)/my/_components/my-page-logged-in.server'
import EmptyState from '@/components/empty-state'
import { getCurrentUser } from '@/lib/auth/session.server'

async function MyPageGateServer() {
	const user = await getCurrentUser()

	if (!user) {
		return (
			<EmptyState
				icon={<UserRoundX className="size-10 text-gray-500" />}
				title="로그인이 필요합니다."
				description="유저 정보를 찾을 수 없습니다. 로그인을 진행해주세요."
				className="border-none"
			/>
		)
	}

	return <MyPageLoggedInServer user={user} />
}

export default MyPageGateServer
