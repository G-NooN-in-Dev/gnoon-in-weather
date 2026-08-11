import type { PropsWithChildren } from 'react'

function ThemeMapsLayout({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 flex-col pt-12 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col py-8">{children}</div>
			</main>
		</div>
	)
}

export default ThemeMapsLayout
