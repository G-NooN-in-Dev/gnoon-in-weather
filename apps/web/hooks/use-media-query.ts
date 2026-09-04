'use client'

import { useSyncExternalStore } from 'react'

/**
 * `window.matchMedia` 구독.
 * SSR·하이드레이션 전에는 `false`를 반환해 mismatch를 피합니다.
 */
function useMediaQuery(query: string) {
	return useSyncExternalStore(
		(onStoreChange) => {
			const media = window.matchMedia(query)
			media.addEventListener('change', onStoreChange)
			return () => media.removeEventListener('change', onStoreChange)
		},
		() => window.matchMedia(query).matches,
		() => false
	)
}

export default useMediaQuery
