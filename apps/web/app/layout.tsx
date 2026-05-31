import '@/global.css'

import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

import Footer from '@/components/footer'
import Header from '@/components/header'

export const metadata: Metadata = {
	title: {
		default: 'G-NooN in Weather',
		template: '%s | G-NooN in Weather'
	},
	description: 'G-NooN in Weather'
}

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="bg-grayscale-100 flex min-h-full w-full flex-col pt-20">
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	)
}

export default RootLayout
