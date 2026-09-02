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
import { toast } from '@shared/ui/sonner'
import { Spinner } from '@shared/ui/spinner'
import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'

import useAppRouter from '@/hooks/use-app-router'
import { requestDeleteAccount } from '@/lib/auth/client'

const ACCOUNT_DELETED_PATH = '/account-deleted'

type AccountDeleteDialogProps = {
	hasFavoriteLocations: boolean
	hasFavoritePressLists: boolean
}

/**
 * 회원탈퇴 확인 다이얼로그.
 * 보유 데이터 목록을 보여준 뒤 탈퇴 API를 호출합니다.
 */
function AccountDeleteDialog({ hasFavoriteLocations, hasFavoritePressLists }: AccountDeleteDialogProps) {
	const router = useAppRouter()
	const [open, setOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		setIsDeleting(true)

		try {
			const result = await requestDeleteAccount()

			if (result.ok) {
				setOpen(false)
				router.push(ACCOUNT_DELETED_PATH)
				router.refresh()

				return
			}

			toast.error(result.message)
		} catch {
			toast.error('회원탈퇴 중 오류가 발생했습니다.')
		} finally {
			setIsDeleting(false)
		}
	}

	const handleOpenChange = (nextOpen: boolean) => {
		if (!isDeleting) {
			setOpen(nextOpen)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						className="text-grayscale-800 hover:text-grayscale-900 w-full px-2 hover:bg-transparent"
					/>
				}
			>
				<span>탈퇴하기</span> <ChevronRightIcon className="size-4" />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>회원탈퇴</DialogTitle>
					<DialogDescription>탈퇴를 하면 아래의 데이터가 전부 사라집니다. 정말 탈퇴하시겠습니까?</DialogDescription>
				</DialogHeader>
				<ul className="text-grayscale-700 list-disc space-y-1 pl-5 text-sm">
					<li>이메일 및 닉네임</li>
					{hasFavoriteLocations ? <li>내 관심지역</li> : null}
					{hasFavoritePressLists ? <li>내 언론사 선호목록</li> : null}
				</ul>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" disabled={isDeleting} />}>취소</DialogClose>
					<Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDelete}>
						{isDeleting ? <Spinner /> : '탈퇴하기'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default AccountDeleteDialog
