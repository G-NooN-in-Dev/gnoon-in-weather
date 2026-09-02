import type { PropsWithChildren } from 'react'

import Footer from '@/components/footer'

/**
 * 전역 푸터가 필요한 라우트.
 * 테마지도 지도 목록(`/theme-maps/airports`, `/theme-maps/baseball`)은 제외합니다.
 */
function WithFooterLayout({ children }: PropsWithChildren) {
	return (
		<>
			{children}
			<Footer />
		</>
	)
}

export default WithFooterLayout
