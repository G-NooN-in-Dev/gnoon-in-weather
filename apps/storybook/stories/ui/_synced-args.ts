import type { ChangeEvent } from 'react'
import { useArgs } from 'storybook/preview-api'

/**
 * Canvas ↔ Controls 양방향 동기화용 Storybook hook 래퍼입니다.
 * React useState 대신 args + updateArgs만 사용합니다.
 */
export function useArgSync<T extends object>() {
	const [args, updateArgs] = useArgs<T>()

	return {
		args,
		/** 단일 arg를 Controls에 반영합니다. */
		setArg<K extends keyof T>(key: K, value: T[K]) {
			updateArgs({ [key]: value } as unknown as Partial<T>)
		},
		/** input/textarea onChange에서 텍스트 arg를 갱신합니다. */
		textChangeHandler<K extends keyof T>(key: K) {
			return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				updateArgs({ [key]: event.target.value } as unknown as Partial<T>)
			}
		}
	}
}
