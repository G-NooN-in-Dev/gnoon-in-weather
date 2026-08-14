import type { PropsWithChildren } from 'react'

/**
 * 테마지도 공통
 * 헤더 ThemeMapsNav(h-12) 아래 여백만 확보하고, 문서의 본문 landmark를 여기서 한 번만 둡니다.
 * 페이지별 컨테이너(max-w-content 등)는 각 page에서 둡니다.
 */
function ThemeMapsLayout({ children }: PropsWithChildren) {
	return <main className="flex min-h-0 w-full flex-1 flex-col pt-12 font-sans">{children}</main>
}

export default ThemeMapsLayout
