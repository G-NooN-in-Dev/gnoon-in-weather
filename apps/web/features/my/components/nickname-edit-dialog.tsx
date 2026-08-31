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
import { requestUpdateNickname } from '@/lib/auth/client'
import type { UpdateNicknameInput } from '@/lib/auth/schemas'

type NicknameEditFormProps = {
	currentNickname: string
	onSuccess: (nickname: string) => void
}

type NicknameEditDialogProps = {
	currentNickname: string
}

/** 닉네임 변경 폼. */

function NicknameEditForm({ currentNickname, onSuccess }: NicknameEditFormProps) {
	const { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit } = useAuthForm<UpdateNicknameInput>({
		initial: { nickname: '' },
		submit: (value) => {
			if (value.nickname.trim() === currentNickname) {
				return Promise.resolve({
					ok: false,
					message: '현재 닉네임과 같습니다.',
					fieldErrors: { nickname: '현재 닉네임과 같습니다.' }
				})
			}

			return requestUpdateNickname(value)
		},
		onSuccess: (user) => {
			onSuccess(user.nickname)
		}
	})

	return (
		<form onSubmit={handleSubmit} className="contents" noValidate>
			<DialogHeader>
				<DialogTitle>닉네임 변경</DialogTitle>
				<DialogDescription>변경할 닉네임을 입력하세요.</DialogDescription>
			</DialogHeader>
			<FieldGroup className="gap-4">
				<Field data-disabled={true}>
					<FieldLabel htmlFor="current-nickname">현재 닉네임</FieldLabel>
					<Input id="current-nickname" value={currentNickname} disabled readOnly />
				</Field>
				<Field data-invalid={Boolean(fieldErrors.nickname) || undefined}>
					<FieldLabel htmlFor="new-nickname">새 닉네임</FieldLabel>
					<Input
						id="new-nickname"
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
 * 닉네임 변경 다이얼로그.
 * 현재 닉네임은 읽기 전용으로 두고, 새 닉네임 제출 시 중복 확인 후 반영합니다.
 */
function NicknameEditDialog({ currentNickname }: NicknameEditDialogProps) {
	const router = useRouter()
	const [open, setOpen] = useState(false)

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button variant="outline" className="text-grayscale-800 hover:text-grayscale-900 px-2 hover:bg-transparent" />
				}
			>
				<span>닉네임 변경하기</span> <ChevronRightIcon className="size-4" />
			</DialogTrigger>
			<DialogContent>
				<NicknameEditForm
					key={open ? 'open' : 'closed'}
					currentNickname={currentNickname}
					onSuccess={(nickname) => {
						toast.success(`닉네임이 ${nickname}(으)로 변경되었습니다.`)
						setOpen(false)
						router.refresh()
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}

export default NicknameEditDialog
export type { NicknameEditDialogProps }
