import '@/global.css'

import { Toaster } from '@shared/ui/sonner'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { PropsWithChildren, Suspense } from 'react'

import Header from '@/components/header'
import NavigationProgress from '@/components/navigation-progress'

export const metadata: Metadata = {
	title: {
		default: 'G-NooN in Weather',
		template: '%s | G-NooN in Weather'
	},
	description: 'G-NooN in Weather',
	icons: {
		icon: '/icon.svg',
		apple: '/apple-icon.svg'
	},
	openGraph: {
		title: 'G-NooN in Weather',
		description: 'G-NooN in Weather',
		url: process.env.BASE_URL ?? 'https://gnoon-in-weather.vercel.app',
		siteName: 'G-NooN in Weather',
		images: [
			{
				url: '/icon.svg',
				alt: 'G-NooN in Weather'
			}
		],
		locale: 'ko-KR',
		type: 'website'
	}
}

function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="bg-grayscale-100 flex min-h-full w-full flex-col pt-14">
				<Suspense fallback={null}>
					<NavigationProgress />
				</Suspense>
				<Header />
				{children}
				<Toaster richColors position="top-center" />
				<Analytics />
			</body>
		</html>
	)
}

export default RootLayout
