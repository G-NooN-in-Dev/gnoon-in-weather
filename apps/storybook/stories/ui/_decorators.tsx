import { Toaster } from '@shared/ui/sonner'
import type { Decorator } from '@storybook/react-vite'

/** Sonner 토스트 데모용 — Toaster 포털을 스토리마다 함께 렌더링합니다. */
export const withToaster: Decorator = (Story) => (
	<>
		<Toaster />
		<Story />
	</>
)
