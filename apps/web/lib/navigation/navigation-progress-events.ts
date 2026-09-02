/** App Router 프로그래매틱 이동 시작을 알리는 커스텀 이벤트 이름 */
const NAVIGATION_START_EVENT = 'app:navigation-start'

/** `useAppRouter`의 push 또는 replace 직전에 호출해 상단 progress bar 시작을 알립니다. */
function dispatchNavigationStart() {
	if (typeof window === 'undefined') {
		return
	}

	window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT))
}

/** `NavigationProgress` 등에서 이동 시작 이벤트를 구독합니다. 반환 함수로 리스너를 해제합니다. */
function subscribeNavigationStart(callback: () => void) {
	if (typeof window === 'undefined') {
		return () => undefined
	}

	window.addEventListener(NAVIGATION_START_EVENT, callback)

	return () => {
		window.removeEventListener(NAVIGATION_START_EVENT, callback)
	}
}

export { dispatchNavigationStart, subscribeNavigationStart }
