import NicknameEditDialog from '@/features/my/components/nickname-edit-dialog'
import type { UserInfoEditSectionProps } from '@/features/my/types/my-page-component.type'

/**
 * 마이페이지 — 닉네임·비밀번호 변경 섹션.
 */
function UserInfoEditSection({ user }: UserInfoEditSectionProps) {
	const { nickname } = user

	return (
		<section className="flex flex-col gap-4 px-4" aria-labelledby="user-info-edit-heading">
			<h2 id="user-info-edit-heading" className="text-xl font-semibold">
				닉네임 변경 / 비밀번호 변경
			</h2>
			<div className="flex items-start gap-2">
				<NicknameEditDialog currentNickname={nickname} />
			</div>
		</section>
	)
}

export default UserInfoEditSection
