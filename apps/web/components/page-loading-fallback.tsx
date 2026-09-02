import { Spinner } from '@shared/ui/spinner'

/**
 * 라우트 전환용 기본 fallback.
 * 헤더·푸터는 layout에 남기고 본문 영역만 로딩 표시합니다.
 */
function PageLoadingFallback() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col items-center justify-center py-24">
					<Spinner className="text-pastel-blue-600 size-10" aria-label="페이지를 불러오는 중" />
				</div>
			</main>
		</div>
	)
}

export default PageLoadingFallback
