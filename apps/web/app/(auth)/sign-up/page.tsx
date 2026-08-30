import type { Metadata } from 'next'

import SignUpClient from '@/app/(auth)/sign-up/_components/sign-up.client'

export const metadata: Metadata = {
	title: '회원가입'
}

function SignUpPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col">
					<SignUpClient />
				</div>
			</main>
		</div>
	)
}

export default SignUpPage
