'use client'

import AuthFormSection from '@/features/auth/sections/auth-form.section'

function SignInClient() {
	return (
		<div className="flex w-full flex-1 items-start justify-center py-12 md:items-center md:py-16">
			<AuthFormSection mode="sign-in" />
		</div>
	)
}

export default SignInClient
