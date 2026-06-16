import { Spinner } from '@shared/ui/spinner'

/**
 * 페이지 전역 로딩 오버레이.
 * 날씨 API fetch·GPS 조회 중 화면 전체를 덮고 상호작용을 막습니다.
 * (Next.js route `loading.tsx` 대신 우선 앱 공용 컴포넌트로 둡니다.)
 */
function Loading() {
	return (
		<div
			className="bg-grayscale-100/80 fixed inset-0 z-50 flex items-center justify-center"
			aria-busy="true"
			aria-live="polite"
		>
			<Spinner className="text-pastel-blue-600 size-10" />
		</div>
	)
}

export default Loading
