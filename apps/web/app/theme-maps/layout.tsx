import type { PropsWithChildren } from 'react'

/**
 * 테마지도 공통 chrome.
 * ThemeMapsNav(h-12)는 lg 이상만 보이므로 여백도 lg부터 확보합니다.
 * 본문 landmark(`main`)·푸터는 `(with-footer)` / `(map)` 레이아웃에서 둡니다.
 */
function ThemeMapsLayout({ children }: PropsWithChildren) {
	return <div className="flex min-h-0 w-full flex-1 flex-col pt-0 font-sans lg:pt-12">{children}</div>
}

export default ThemeMapsLayout
