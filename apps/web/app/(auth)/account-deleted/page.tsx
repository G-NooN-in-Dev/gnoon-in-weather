import GoHomeButton from '@/app/(auth)/account-deleted/_components/go-home-button.client'

/**
 * 회원탈퇴 완료 페이지.
 * 탈퇴 처리 후 세션이 제거된 상태에서 접근합니다.
 */
function AccountDeletedPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col items-center justify-center gap-6 py-8 text-center">
					<div className="flex flex-col gap-1">
						<p className="text-xl font-semibold">회원탈퇴가 완료되었습니다.</p>
						<p className="text-grayscale-700">이용해 주셔서 감사합니다.</p>
					</div>
					<GoHomeButton />
				</div>
			</main>
		</div>
	)
}

export default AccountDeletedPage
