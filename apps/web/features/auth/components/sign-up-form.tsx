'use client'

import { Button } from '@shared/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { toast } from '@shared/ui/sonner'
import { Spinner } from '@shared/ui/spinner'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, useState } from 'react'

import useAuthForm from '@/features/auth/hooks/use-auth-form'
import { requestCheckNicknameAvailability, requestSignUp } from '@/lib/auth/client'
import type { SignUpInput } from '@/lib/auth/schemas'

function SignUpForm() {
	const router = useRouter()
	const [isCheckingNickname, setIsCheckingNickname] = useState(false)
	const [isNicknameVerified, setIsNicknameVerified] = useState(false)
	const [nicknameCheckError, setNicknameCheckError] = useState<string | undefined>()

	const { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit } = useAuthForm<SignUpInput>({
		initial: {
			email: '',
			nickname: '',
			password: '',
			passwordConfirm: ''
		},
		submit: requestSignUp,
		onSuccess: () => {
			toast.success('회원가입이 완료되었습니다.')
			router.replace('/')
			router.refresh()
		}
	})

	const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
		handleChange(event)
		setIsNicknameVerified(false)
		setNicknameCheckError(undefined)
	}

	const handleCheckNickname = async () => {
		setIsCheckingNickname(true)
		setNicknameCheckError(undefined)

		try {
			const result = await requestCheckNicknameAvailability(formValue.nickname)

			if (!result.ok) {
				setIsNicknameVerified(false)
				setNicknameCheckError(result.fieldErrors.nickname ?? result.message)
				return
			}

			if (!result.available) {
				setIsNicknameVerified(false)
				setNicknameCheckError('이미 사용 중인 닉네임입니다.')
				return
			}

			setIsNicknameVerified(true)
			toast.success('사용 가능한 닉네임입니다.')
		} finally {
			setIsCheckingNickname(false)
		}
	}

	const nicknameError = fieldErrors.nickname ?? nicknameCheckError

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

				<Field data-invalid={Boolean(nicknameError) || undefined}>
					<FieldLabel htmlFor="sign-up-nickname">닉네임</FieldLabel>
					<div className="flex gap-2">
						<Input
							id="sign-up-nickname"
							name="nickname"
							type="text"
							autoComplete="nickname"
							value={formValue.nickname}
							onChange={handleNicknameChange}
							aria-invalid={Boolean(nicknameError) || undefined}
							placeholder="2~20자"
							minLength={2}
							maxLength={20}
							className="min-w-0 flex-1"
						/>
						<Button
							type="button"
							variant="outline"
							className="shrink-0"
							disabled={isCheckingNickname || !formValue.nickname.trim() || isNicknameVerified}
							onClick={handleCheckNickname}
						>
							{isCheckingNickname ? <Spinner /> : '중복확인'}
						</Button>
					</div>
					{isNicknameVerified && !nicknameError ? (
						<p className="text-success-700 text-sm">사용 가능한 닉네임입니다.</p>
					) : null}
					<FieldError>{nicknameError}</FieldError>
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
				{isSubmitting ? <Spinner /> : '가입하기'}
			</Button>
		</form>
	)
}

export default SignUpForm
