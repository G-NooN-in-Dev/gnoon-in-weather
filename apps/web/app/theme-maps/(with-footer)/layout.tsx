import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'

/**
 * 테마지도 중 푸터가 필요한 페이지(홈·상세).
 */
function ThemeMapsWithFooterLayout({ children }: PropsWithChildren) {
	return (
		<>
			<main className="flex min-h-0 w-full flex-1 flex-col">{children}</main>
			<Footer />
		</>
	)
}

export default ThemeMapsWithFooterLayout
