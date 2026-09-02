import type { PropsWithChildren } from 'react'

/**
 * 테마지도 지도 목록 — 전체 높이 확보, 푸터 없음.
 */
function ThemeMapsMapLayout({ children }: PropsWithChildren) {
	return <main className="flex min-h-0 w-full flex-1 flex-col">{children}</main>
}

export default ThemeMapsMapLayout
