'use client'

import { Button } from '@shared/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@shared/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { toast } from '@shared/ui/sonner'
import { Spinner } from '@shared/ui/spinner'
import { ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import useAuthForm from '@/features/auth/hooks/use-auth-form'
import { requestUpdatePassword } from '@/lib/auth/client'
import type { UpdatePasswordInput } from '@/lib/auth/schemas'

type PasswordEditFormProps = {
	onSuccess: () => void
}

/** 비밀번호 변경 폼. */
function PasswordEditForm({ onSuccess }: PasswordEditFormProps) {
	const { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit } = useAuthForm<UpdatePasswordInput>({
		initial: {
			currentPassword: '',
			newPassword: '',
			newPasswordConfirm: ''
		},
		submit: requestUpdatePassword,
		onSuccess: () => {
			onSuccess()
		}
	})

	return (
		<form onSubmit={handleSubmit} className="contents" noValidate>
			<DialogHeader>
				<DialogTitle>비밀번호 변경</DialogTitle>
				<DialogDescription>현재 비밀번호와 새 비밀번호를 입력하세요.</DialogDescription>
			</DialogHeader>
			<FieldGroup className="gap-4">
				<Field data-invalid={Boolean(fieldErrors.currentPassword) || undefined}>
					<FieldLabel htmlFor="current-password">현재 비밀번호 확인</FieldLabel>
					<Input
						id="current-password"
						name="currentPassword"
						type="password"
						autoComplete="current-password"
						value={formValue.currentPassword}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.currentPassword) || undefined}
						placeholder="현재 비밀번호를 입력하세요"
					/>
					<FieldError>{fieldErrors.currentPassword}</FieldError>
				</Field>
				<Field data-invalid={Boolean(fieldErrors.newPassword) || undefined}>
					<FieldLabel htmlFor="new-password">새 비밀번호</FieldLabel>
					<Input
						id="new-password"
						name="newPassword"
						type="password"
						autoComplete="new-password"
						value={formValue.newPassword}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.newPassword) || undefined}
						placeholder="6~12자로 입력하세요"
					/>
					<FieldError>{fieldErrors.newPassword}</FieldError>
				</Field>
				<Field data-invalid={Boolean(fieldErrors.newPasswordConfirm) || undefined}>
					<FieldLabel htmlFor="new-password-confirm">새 비밀번호 확인</FieldLabel>
					<Input
						id="new-password-confirm"
						name="newPasswordConfirm"
						type="password"
						autoComplete="new-password"
						value={formValue.newPasswordConfirm}
						onChange={handleChange}
						aria-invalid={Boolean(fieldErrors.newPasswordConfirm) || undefined}
						placeholder="새 비밀번호를 한 번 더 입력하세요"
					/>
					<FieldError>{fieldErrors.newPasswordConfirm}</FieldError>
				</Field>
			</FieldGroup>
			<DialogFooter>
				<DialogClose render={<Button type="button" variant="outline" />}>취소</DialogClose>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? <Spinner /> : '변경'}
				</Button>
			</DialogFooter>
		</form>
	)
}

/**
 * 비밀번호 변경 다이얼로그.
 * 현재 비밀번호 확인 후 새 비밀번호·확인을 제출합니다.
 */
function PasswordEditDialog() {
	const router = useRouter()
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button variant="outline" className="text-grayscale-800 hover:text-grayscale-900 px-2 hover:bg-transparent" />
				}
			>
				<span>비밀번호 변경하기</span> <ChevronRightIcon className="size-4" />
			</DialogTrigger>
			<DialogContent>
				<PasswordEditForm
					key={open ? 'open' : 'closed'}
					onSuccess={() => {
						toast.success('비밀번호가 변경되었습니다.')
						setOpen(false)
						router.refresh()
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}

export default PasswordEditDialog
