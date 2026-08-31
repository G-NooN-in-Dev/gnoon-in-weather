'use client'

import { Button } from '@shared/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@shared/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@shared/ui/field'
import { Input } from '@shared/ui/input'
import { Separator } from '@shared/ui/separator'
import { Spinner } from '@shared/ui/spinner'
import { FormEvent, useState } from 'react'

import {
	FAVORITE_PRESS_LIST_MAX_PRESSES,
	FAVORITE_PRESS_LIST_NAME_MAX,
	FAVORITE_PRESS_LIST_NAME_MIN
} from '@/lib/favorite-press-list/constants'
import { createFavoritePressListSchema } from '@/lib/favorite-press-list/schemas'
import { PRESS_FILTER_GROUPS, PressEntry } from '@/lib/naver/broadcast-press-list'

import PressBadge from './press-badge'
import SelectedPressLists from './selected-press-lists'

type FavoritePressListsCreateDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	isSubmitting: boolean
	onSave: (input: { name: string; domains: string[] }) => Promise<boolean>
}

/**
 * 새 선호목록을 생성합니다.
 */
function FavoritePressListsCreateDialog({
	open,
	onOpenChange,
	isSubmitting,
	onSave
}: FavoritePressListsCreateDialogProps) {
	const [name, setName] = useState('')
	const [nameError, setNameError] = useState<string | null>(null)
	const [selectedPresses, setSelectedPresses] = useState<PressEntry[]>([])
	const [pressError, setPressError] = useState<string | null>(null)

	const resetForm = () => {
		setName('')
		setNameError(null)
		setSelectedPresses([])
		setPressError(null)
	}

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			resetForm()
		}

		onOpenChange(nextOpen)
	}

	const handleToggle = (press: PressEntry) => {
		const { domain } = press

		setPressError(null)
		setSelectedPresses((prev) => {
			if (prev.some((item) => item.domain === domain)) {
				return prev.filter((item) => item.domain !== domain)
			}

			if (prev.length >= FAVORITE_PRESS_LIST_MAX_PRESSES) {
				return prev
			}

			return [...prev, press]
		})
	}

	const handleRemove = (domain: string) => {
		setPressError(null)
		setSelectedPresses((prev) => prev.filter((item) => item.domain !== domain))
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const domains = selectedPresses.map((press) => press.domain)
		const parsed = createFavoritePressListSchema.safeParse({ name, domains })

		if (!parsed.success) {
			const nameIssue = parsed.error.issues.find((issue) => issue.path[0] === 'name')
			const domainsIssue = parsed.error.issues.find((issue) => issue.path[0] === 'domains')

			setNameError(nameIssue?.message ?? null)
			setPressError(domainsIssue?.message ?? null)
			return
		}

		setNameError(null)
		setPressError(null)

		const saved = await onSave(parsed.data)

		if (saved) {
			handleOpenChange(false)
		}
	}

	const selectedDomainSet = new Set(selectedPresses.map((press) => press.domain))
	const isSelectedListAtLimit = selectedPresses.length >= FAVORITE_PRESS_LIST_MAX_PRESSES

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
				<form onSubmit={(event) => void handleSubmit(event)} className="contents" noValidate>
					<DialogHeader>
						<DialogTitle>선호목록 추가</DialogTitle>
						<DialogDescription>
							선호목록으로 지정할 언론사를 선택하세요. (최대 {FAVORITE_PRESS_LIST_MAX_PRESSES} 개)
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4">
						{PRESS_FILTER_GROUPS.map((group) => {
							const { id, label, items } = group

							return (
								<div key={id} className="flex flex-col gap-2">
									<h3 className="text-grayscale-600 text-sm font-medium">{label}</h3>
									<ul className="flex flex-wrap gap-2">
										{items.map((press) => {
											const isSelected = selectedDomainSet.has(press.domain)
											const isDisabled = isSelectedListAtLimit && !isSelected

											return (
												<li key={press.domain}>
													<PressBadge
														press={press}
														isSelected={isSelected}
														isDisabled={isDisabled}
														onToggle={handleToggle}
													/>
												</li>
											)
										})}
									</ul>
								</div>
							)
						})}

						<Separator />

						<div className="flex flex-col gap-3">
							<p className="text-grayscale-900 text-sm font-semibold">
								선택됨 ({selectedPresses.length}/{FAVORITE_PRESS_LIST_MAX_PRESSES})
							</p>

							<SelectedPressLists
								selectedPresses={selectedPresses}
								selectedCount={selectedPresses.length}
								onRemove={handleRemove}
								isSubmitting={isSubmitting}
							/>

							{pressError ? <p className="text-destructive text-sm">{pressError}</p> : null}
						</div>

						<Separator />

						<FieldGroup className="gap-4">
							<Field data-invalid={Boolean(nameError) || undefined}>
								<FieldLabel htmlFor="favorite-press-list-name">선호목록 이름</FieldLabel>
								<Input
									id="favorite-press-list-name"
									name="name"
									type="text"
									value={name}
									onChange={(event) => {
										setName(event.target.value)
										setNameError(null)
									}}
									aria-invalid={Boolean(nameError) || undefined}
									placeholder={`${FAVORITE_PRESS_LIST_NAME_MIN}~${FAVORITE_PRESS_LIST_NAME_MAX}자`}
									autoComplete="off"
									disabled={isSubmitting}
									minLength={FAVORITE_PRESS_LIST_NAME_MIN}
									maxLength={FAVORITE_PRESS_LIST_NAME_MAX}
								/>
								<FieldError>{nameError}</FieldError>
							</Field>
						</FieldGroup>
					</div>

					<DialogFooter>
						<DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>취소</DialogClose>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? <Spinner /> : '저장'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default FavoritePressListsCreateDialog
export type { FavoritePressListsCreateDialogProps }
