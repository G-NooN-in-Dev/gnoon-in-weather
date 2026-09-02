'use client'

import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import Link from 'next/link'

import SignInForm from '@/features/auth/components/sign-in-form'
import SignUpForm from '@/features/auth/components/sign-up-form'
import type { AuthFormMode, AuthFormSectionProps } from '@/features/auth/types/auth-component.type'

const FORM_LABELS = {
	'sign-in': {
		title: '로그인',
		description: '이메일과 비밀번호로 로그인하세요.',
		switchHref: '/sign-up',
		switchLabel: '회원가입',
		switchHint: '아직 계정이 없으신가요?'
	},
	'sign-up': {
		title: '회원가입',
		description: '새 계정을 만드세요.',
		switchHref: '/sign-in',
		switchLabel: '로그인',
		switchHint: '이미 계정이 있으신가요?'
	}
} as const satisfies Record<
	AuthFormMode,
	{
		title: string
		description: string
		switchHref: string
		switchLabel: string
		switchHint: string
	}
>

function AuthFormSection({ mode }: AuthFormSectionProps) {
	const labels = FORM_LABELS[mode]

	const { description, switchHint, switchHref, switchLabel, title } = labels

	return (
		<Card className="border-grayscale-300 w-full max-w-md shadow-xs">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{mode === 'sign-in' ? <SignInForm /> : <SignUpForm />}

				<div className="flex flex-col gap-2">
					<p className="text-grayscale-600 text-center text-sm">{switchHint}</p>
					<Link href={switchHref} className="w-full">
						<Button type="button" variant="outline" className="w-full">
							{switchLabel}
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}

export default AuthFormSection
