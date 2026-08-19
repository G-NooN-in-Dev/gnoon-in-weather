'use client'

import { usePathname } from 'next/navigation'

import { hideFooter } from '@/lib/layout/hide-footer'

function Footer() {
	const pathname = usePathname()

	if (hideFooter(pathname)) return null

	return <footer>Footer 추가 예정</footer>
}

export default Footer
