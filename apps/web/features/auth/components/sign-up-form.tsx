'use client'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Spinner } from '@shared/ui/spinner'
import { useRouter } from 'next/navigation'

import useAuthForm from '@/features/auth/hooks/use-auth-form'
import { requestSignUp } from '@/lib/auth/client'
import type { SignUpInput } from '@/lib/auth/schemas'

function SignUpForm() {
	const router = useRouter()
	const { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit } = useAuthForm<SignUpInput>({
		initial: {
			email: '',
			nickname: '',
			password: '',
			passwordConfirm: ''
		},
		submit: requestSignUp,
		onSuccess: () => {
			router.replace('/')
			router.refresh()
		}
	})

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
			<FieldGroup>
				<Field data-invalid={Boolean(fieldErrors.email) || undefined}>
					<FieldLabel htmlFor="sign-up-email">이메일</FieldLabel>
					<Input
						id="sign-up-email"
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

				<Field data-invalid={Boolean(fieldErrors.nickname) || undefined}>
					<FieldLabel htmlFor="sign-up-nickname">닉네임</FieldLabel>
					<Input
						id="sign-up-nickname"
						name="nickname"
						type="text"
						autoComplete="nickname"
						value={formValue.nickname}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.nickname) || undefined}
						placeholder="2~20자"
					/>
					<FieldError>{fieldErrors.nickname}</FieldError>
				</Field>

				<Field data-invalid={Boolean(fieldErrors.password) || undefined}>
					<FieldLabel htmlFor="sign-up-password">비밀번호</FieldLabel>
					<Input
						id="sign-up-password"
						name="password"
						type="password"
						autoComplete="new-password"
						value={formValue.password}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.password) || undefined}
						placeholder="6~12자로 입력하세요"
					/>
					<FieldError>{fieldErrors.password}</FieldError>
				</Field>

				<Field data-invalid={Boolean(fieldErrors.passwordConfirm) || undefined}>
					<FieldLabel htmlFor="sign-up-password-confirm">비밀번호 확인</FieldLabel>
					<Input
						id="sign-up-password-confirm"
						name="passwordConfirm"
						type="password"
						autoComplete="new-password"
						value={formValue.passwordConfirm}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.passwordConfirm) || undefined}
						placeholder="비밀번호를 한 번 더 입력하세요"
					/>
					<FieldError>{fieldErrors.passwordConfirm}</FieldError>
				</Field>
			</FieldGroup>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? <Spinner /> : '회원가입'}
			</Button>
		</form>
	)
}

export default SignUpForm
