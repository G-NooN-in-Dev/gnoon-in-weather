'use client'

import { toast } from '@shared/ui/sonner'
import { type ChangeEvent, type FormEvent, useState } from 'react'

import type { AuthFormResult } from '@/lib/auth/client'

type UseAuthFormOptions<T extends Record<string, string>> = {
	initial: T
	submit: (value: T) => Promise<AuthFormResult>
	onSuccess: () => void
}

/**
 * auth 폼의 값·필드 에러·제출 상태와 onChange/onSubmit을 묶습니다.
 */
function useAuthForm<T extends Record<string, string>>({ initial, submit, onSuccess }: UseAuthFormOptions<T>) {
	const [formValue, setFormValue] = useState(initial)
	const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target
		setFormValue((prev) => ({ ...prev, [name]: value }))
		setFieldErrors((prev) => {
			if (!prev[name]) return prev
			const next = { ...prev }
			delete next[name]
			return next
		})
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setFieldErrors({})

		try {
			const result = await submit(formValue)

			if (!result.ok) {
				toast.error(result.message)
				setFieldErrors(result.fieldErrors)
				return
			}

			onSuccess()
		} finally {
			setIsSubmitting(false)
		}
	}

	return { formValue, fieldErrors, isSubmitting, handleChange, handleSubmit }
}

export default useAuthForm
export type { UseAuthFormOptions }
