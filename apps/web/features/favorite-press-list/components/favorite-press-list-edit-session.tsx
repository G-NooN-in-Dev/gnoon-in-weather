'use client'

import { useState } from 'react'

import { FAVORITE_PRESS_LIST_MAX_PRESSES } from '@/lib/favorite-press-list/constants'
import { resolvePressEntries } from '@/lib/favorite-press-list/domains'
import type { PressEntry } from '@/lib/naver/broadcast-press-list'
import type { FavoritePressList } from '@/types/favorite-press-list.type'

import FavoritePressListEditForm from './favorite-press-list-edit-form'

type FavoritePressListEditSessionProps = {
	list: FavoritePressList
	isPending: boolean
	cancelLabel?: string
	onClose: () => void
	onUpdate: (list: FavoritePressList, domains: string[]) => Promise<boolean>
}

/**
 * 단일 선호목록 수정 세션. key로 리마운트해 draft 상태를 초기화합니다.
 */
function FavoritePressListEditSession({
	list,
	isPending,
	cancelLabel = '뒤로',
	onClose,
	onUpdate
}: FavoritePressListEditSessionProps) {
	const [draftPresses, setDraftPresses] = useState(() => resolvePressEntries(list.domains))

	const handleToggleDraft = (press: PressEntry) => {
		const { domain } = press

		setDraftPresses((prev) => {
			if (prev.some((item) => item.domain === domain)) {
				return prev.filter((item) => item.domain !== domain)
			}

			if (prev.length >= FAVORITE_PRESS_LIST_MAX_PRESSES) {
				return prev
			}

			return [...prev, press]
		})
	}

	const handleRemoveDraft = (domain: string) => {
		setDraftPresses((prev) => prev.filter((item) => item.domain !== domain))
	}

	const handleSave = async () => {
		if (draftPresses.length === 0) {
			return
		}

		const domains = draftPresses.map((press) => press.domain)
		const updated = await onUpdate(list, domains)

		if (updated) {
			onClose()
		}
	}

	return (
		<FavoritePressListEditForm
			list={list}
			draftPresses={draftPresses}
			onToggle={handleToggleDraft}
			onRemove={handleRemoveDraft}
			isSubmitting={isPending}
			cancelLabel={cancelLabel}
			onCancel={onClose}
			onSave={handleSave}
		/>
	)
}

export default FavoritePressListEditSession
