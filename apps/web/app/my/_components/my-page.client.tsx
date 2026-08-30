import UserInfoEditSection from '@/features/my/sections/user-info-edit.section'
import type { MyPageClientProps } from '@/features/my/types/my-page-component.type'

/**
 * 마이페이지 client 조합기.
 */
function MyPageClient({ user }: MyPageClientProps) {
	return (
		<div className="flex flex-col gap-6">
			<UserInfoEditSection user={user} />
		</div>
	)
}

export default MyPageClient
