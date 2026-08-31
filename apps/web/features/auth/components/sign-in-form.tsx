'use client'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Spinner } from '@shared/ui/spinner'
import { useRouter } from 'next/navigation'

import useAuthForm from '@/features/auth/hooks/use-auth-form'
import { requestSignIn } from '@/lib/auth/client'
import type { SignInInput } from '@/lib/auth/schemas'

function SignInForm() {
	const router = useRouter()
	const { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit } = useAuthForm<SignInInput>({
		initial: {
			email: '',
			password: ''
		},
		submit: requestSignIn,
		onSuccess: () => {
			router.replace('/')
			router.refresh()
		}
	})

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
			<FieldGroup>
				<Field data-invalid={Boolean(fieldErrors.email) || undefined}>
					<FieldLabel htmlFor="sign-in-email">이메일</FieldLabel>
					<Input
						id="sign-in-email"
						name="email"
						type="email"
						autoComplete="email"
						value={formValue.email}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.email) || undefined}
						placeholder="you@example.com"
					/>
					<FieldError>{fieldErrors.email}</FieldError>
				</Field>

				<Field data-invalid={Boolean(fieldErrors.password) || undefined}>
					<FieldLabel htmlFor="sign-in-password">비밀번호</FieldLabel>
					<Input
						id="sign-in-password"
						name="password"
						type="password"
						autoComplete="current-password"
						value={formValue.password}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.password) || undefined}
						placeholder="비밀번호를 입력하세요"
					/>
					<FieldError>{fieldErrors.password}</FieldError>
				</Field>
			</FieldGroup>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? <Spinner /> : '로그인'}
			</Button>
		</form>
	)
}

export default SignInForm
