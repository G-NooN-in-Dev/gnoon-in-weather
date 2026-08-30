import { UserRoundX } from 'lucide-react'

import EmptyState from '@/components/empty-state'
import { getCurrentUser } from '@/lib/auth/session.server'

import MyPageClient from './_components/my-page.client'

async function MyPage() {
	const user = await getCurrentUser()

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">
					{user ? (
						<MyPageClient user={user} />
					) : (
						<EmptyState
							icon={<UserRoundX className="size-10 text-gray-500" />}
							title="로그인이 필요합니다."
							description="유저 정보를 찾을 수 없습니다. 로그인을 진행해주세요."
							className="border-none"
						/>
					)}
				</div>
				3
			</main>
		</div>
	)
}

export default MyPage
