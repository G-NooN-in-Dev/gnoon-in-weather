import './preview.css'

import { TooltipProvider } from '@shared/ui/tooltip'
import type { Preview } from '@storybook/react-vite'

/** Storybook 툴바 테마 전환용 글로벌 타입 */
type StoryGlobals = {
	theme: 'light' | 'dark'
}

const preview: Preview = {
	globalTypes: {
		theme: {
			description: '라이트/다크 모드 미리보기',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' }
				],
				dynamicTitle: true
			}
		}
	},
	initialGlobals: {
		theme: 'light'
	},
	decorators: [
		(Story, { globals }) => {
			const { theme } = globals as StoryGlobals

			return (
				<div className={theme === 'dark' ? 'dark' : ''}>
					<div className="bg-background text-foreground min-h-30 p-6 font-sans">
						<TooltipProvider>
							<Story />
						</TooltipProvider>
					</div>
				</div>
			)
		}
	],
	parameters: {
		layout: 'centered',
		controls: {
			expanded: true,
			sort: 'alpha',
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		docs: {
			toc: true
		},
		a11y: {
			// 'todo' — 위반 항목을 테스트 패널에 표시하되 CI는 통과
			test: 'todo'
		},
		backgrounds: {
			disable: true
		}
	}
}

export default preview
