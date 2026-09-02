import { Spinner } from '@shared/ui/spinner'

/**
 * 페이지 내 데이터 fetch·GPS 조회용 전역 로딩 오버레이.
 * 라우트 전환 UI는 `loading.tsx`·`NavigationProgress`·페이지 Suspense fallback을 사용합니다.
 */
function LoadingComponent() {
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

export default LoadingComponent
