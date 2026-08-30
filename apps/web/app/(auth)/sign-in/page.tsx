import type { Metadata } from 'next'

import SignInClient from '@/app/(auth)/sign-in/_components/sign-in.client'

export const metadata: Metadata = {
	title: '로그인'
}

function SignInPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col">
					<SignInClient />
				</div>
			</main>
		</div>
	)
}

export default SignInPage
