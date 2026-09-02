import type { PropsWithChildren } from 'react'

/**
 * 테마지도 공통 chrome.
 * 헤더 ThemeMapsNav(h-12) 아래 여백만 확보합니다.
 * 본문 landmark(`main`)·푸터는 `(with-footer)` / `(map)` 레이아웃에서 둡니다.
 */
function ThemeMapsLayout({ children }: PropsWithChildren) {
	return <div className="flex min-h-0 w-full flex-1 flex-col pt-12 font-sans">{children}</div>
}

export default ThemeMapsLayout
