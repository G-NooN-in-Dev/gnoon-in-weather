'use client'

import { useSyncExternalStore } from 'react'

/** 구독 없음 — 클라이언트 여부만 스냅샷으로 구분할 때 사용 */
function subscribe() {
	return () => {}
}

/**
 * SSR·첫 서버 HTML에서는 false, 클라이언트에서는 true.
 * 기기 시각·window 등 서버와 다른 값을 쓸 때 hydrate mismatch를 피합니다.
 * (React 19: useEffect+setState보다 useSyncExternalStore를 우선)
 */
function useIsClient() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	)
}

export default useIsClient
