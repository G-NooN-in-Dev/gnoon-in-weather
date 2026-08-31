'use client'

import { Button } from '@shared/ui/button'
import { Spinner } from '@shared/ui/spinner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { requestSignOut } from '@/lib/auth/client'

type AuthHeaderActionsProps = {
	nickname: string
}

function AuthHeaderActions({ nickname }: AuthHeaderActionsProps) {
	const router = useRouter()
	const [isSigningOut, setIsSigningOut] = useState(false)

	async function handleSignOut() {
		setIsSigningOut(true)
		await requestSignOut()
		setIsSigningOut(false)
		router.refresh()
	}

	return (
		<div className="flex items-center gap-3">
			<span className="text-grayscale-900 hidden text-sm sm:inline">{nickname} 님</span>
			<Button type="button" className="cursor-pointer p-3" disabled={isSigningOut} onClick={handleSignOut}>
				{isSigningOut ? <Spinner /> : '로그아웃'}
			</Button>
		</div>
	)
}

export default AuthHeaderActions
